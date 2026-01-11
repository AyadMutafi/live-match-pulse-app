import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Player {
  id: number;
  name: string;
  position: string;
  shirtNumber: number;
}

interface MatchLineup {
  team: {
    id: number;
    name: string;
    formation: string;
  };
  lineup: Player[];
  bench: Player[];
  coach?: {
    name: string;
  };
}

interface MatchEvent {
  minute: number;
  type: string;
  team: { name: string };
  player?: { name: string };
  assist?: { name: string };
  detail?: string;
}

interface MatchDetails {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  matchday: number;
  competition: {
    id: number;
    name: string;
  };
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    formation?: string;
    lineup?: Player[];
    bench?: Player[];
    coach?: { name: string };
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    formation?: string;
    lineup?: Player[];
    bench?: Player[];
    coach?: { name: string };
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  goals?: MatchEvent[];
  bookings?: MatchEvent[];
  substitutions?: MatchEvent[];
  venue?: string;
  referees?: { name: string; nationality: string }[];
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const footballDataApiKey = Deno.env.get('FOOTBALL_DATA_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { matchId, apiMatchId } = await req.json().catch(() => ({}));
    
    // If matchId provided, fetch the api_match_id from database
    let externalMatchId = apiMatchId;
    
    if (matchId && !externalMatchId) {
      const { data: matchData } = await supabase
        .from('matches')
        .select('api_match_id')
        .eq('id', matchId)
        .single();
      
      externalMatchId = matchData?.api_match_id;
    }

    if (!externalMatchId) {
      return new Response(
        JSON.stringify({ error: 'Match ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching details for match: ${externalMatchId}`);

    // Fetch detailed match information including lineups
    const response = await fetch(
      `https://api.football-data.org/v4/matches/${externalMatchId}`,
      {
        headers: {
          'X-Auth-Token': footballDataApiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch match details from external API' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const matchDetails: MatchDetails = await response.json();

    console.log(`Match status: ${matchDetails.status}, Minute: ${matchDetails.minute || 'N/A'}`);

    // Update match in database with latest info
    const { error: updateError } = await supabase
      .from('matches')
      .update({
        status: matchDetails.status.toLowerCase(),
        home_score: matchDetails.score.fullTime.home ?? 0,
        away_score: matchDetails.score.fullTime.away ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq('api_match_id', externalMatchId);

    if (updateError) {
      console.error('Error updating match:', updateError);
    }

    // Upsert players if lineup data is available
    if (matchDetails.homeTeam.lineup || matchDetails.awayTeam.lineup) {
      const { data: teams } = await supabase
        .from('teams')
        .select('id, name')
        .in('name', [matchDetails.homeTeam.name, matchDetails.awayTeam.name]);

      const teamNameToId = new Map(teams?.map(t => [t.name, t.id]) || []);

      const playersToUpsert: { name: string; team_id: string; position: string }[] = [];

      const processPlayers = (players: Player[] | undefined, teamName: string) => {
        const teamId = teamNameToId.get(teamName);
        if (!teamId || !players) return;
        
        players.forEach(player => {
          playersToUpsert.push({
            name: player.name,
            team_id: teamId,
            position: player.position || 'Unknown',
          });
        });
      };

      processPlayers(matchDetails.homeTeam.lineup, matchDetails.homeTeam.name);
      processPlayers(matchDetails.homeTeam.bench, matchDetails.homeTeam.name);
      processPlayers(matchDetails.awayTeam.lineup, matchDetails.awayTeam.name);
      processPlayers(matchDetails.awayTeam.bench, matchDetails.awayTeam.name);

      if (playersToUpsert.length > 0) {
        console.log(`Upserting ${playersToUpsert.length} players...`);
        const { error: playerError } = await supabase
          .from('players')
          .upsert(playersToUpsert, { onConflict: 'name,team_id', ignoreDuplicates: true });
        
        if (playerError) {
          console.error('Error upserting players:', playerError);
        }
      }
    }

    // Build response with all match details
    const result = {
      id: externalMatchId,
      status: matchDetails.status,
      minute: matchDetails.minute,
      matchday: matchDetails.matchday,
      competition: matchDetails.competition.name,
      venue: matchDetails.venue,
      utcDate: matchDetails.utcDate,
      score: {
        fullTime: matchDetails.score.fullTime,
        halfTime: matchDetails.score.halfTime,
        winner: matchDetails.score.winner,
      },
      homeTeam: {
        name: matchDetails.homeTeam.name,
        shortName: matchDetails.homeTeam.shortName,
        formation: matchDetails.homeTeam.formation,
        lineup: matchDetails.homeTeam.lineup?.map(p => ({
          name: p.name,
          position: p.position,
          shirtNumber: p.shirtNumber,
        })),
        bench: matchDetails.homeTeam.bench?.map(p => ({
          name: p.name,
          position: p.position,
          shirtNumber: p.shirtNumber,
        })),
        coach: matchDetails.homeTeam.coach?.name,
      },
      awayTeam: {
        name: matchDetails.awayTeam.name,
        shortName: matchDetails.awayTeam.shortName,
        formation: matchDetails.awayTeam.formation,
        lineup: matchDetails.awayTeam.lineup?.map(p => ({
          name: p.name,
          position: p.position,
          shirtNumber: p.shirtNumber,
        })),
        bench: matchDetails.awayTeam.bench?.map(p => ({
          name: p.name,
          position: p.position,
          shirtNumber: p.shirtNumber,
        })),
        coach: matchDetails.awayTeam.coach?.name,
      },
      goals: matchDetails.goals?.map(g => ({
        minute: g.minute,
        team: g.team.name,
        scorer: g.player?.name,
        assist: g.assist?.name,
        type: g.detail,
      })),
      bookings: matchDetails.bookings?.map(b => ({
        minute: b.minute,
        team: b.team.name,
        player: b.player?.name,
        card: b.detail,
      })),
      substitutions: matchDetails.substitutions?.map(s => ({
        minute: s.minute,
        team: s.team.name,
        playerOut: s.player?.name,
        playerIn: s.assist?.name,
      })),
      referees: matchDetails.referees?.map(r => ({
        name: r.name,
        nationality: r.nationality,
      })),
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-match-details function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
