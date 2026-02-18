import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FootballDataTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  competition: {
    id: number;
    name: string;
  };
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per minute (strict for external API calls)
const RATE_WINDOW = 60 * 1000; // 1 minute

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

  // Rate limiting check
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

    console.log('Fetching matches from football-data.org API...');

    // This function fetches from a trusted external API with a fixed date window
    // No user input is accepted.
    // We fetch a small history + upcoming fixtures so the app can show:
    // - recent finished matches ("yesterday")
    // - live matches
    // - upcoming matches
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dateFrom = twoDaysAgo.toISOString().split('T')[0];
    const dateTo = sevenDaysFromNow.toISOString().split('T')[0];

    console.log(`Fetching matches from ${dateFrom} to ${dateTo}`);

    const response = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          'X-Auth-Token': footballDataApiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch matches from external API' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const matches: FootballDataMatch[] = data.matches || [];

    console.log(`Found ${matches.length} matches`);

    const processedTeams = new Map<number, string>();
    const teamInserts = [];

    // First pass: collect all unique teams
    for (const match of matches) {
      if (!processedTeams.has(match.homeTeam.id)) {
        processedTeams.set(match.homeTeam.id, match.homeTeam.name);
        teamInserts.push({
          name: match.homeTeam.name,
          league: match.competition.name,
          country: match.homeTeam.tla || 'Unknown',
          colors: { primary: '#000000', secondary: '#FFFFFF' },
          social_handles: { twitter: '', instagram: '' },
        });
      }
      
      if (!processedTeams.has(match.awayTeam.id)) {
        processedTeams.set(match.awayTeam.id, match.awayTeam.name);
        teamInserts.push({
          name: match.awayTeam.name,
          league: match.competition.name,
          country: match.awayTeam.tla || 'Unknown',
          colors: { primary: '#000000', secondary: '#FFFFFF' },
          social_handles: { twitter: '', instagram: '' },
        });
      }
    }

    // Insert teams if needed
    if (teamInserts.length > 0) {
      console.log(`Inserting ${teamInserts.length} new teams...`);
      const { error: teamError } = await supabase
        .from('teams')
        .upsert(teamInserts, { onConflict: 'name', ignoreDuplicates: true });
      
      if (teamError) {
        console.error('Error inserting teams:', teamError);
      }
    }

    // Fetch all teams to get their IDs
    const { data: allTeams } = await supabase
      .from('teams')
      .select('id, name');
    
    const teamNameToId = new Map(allTeams?.map(t => [t.name, t.id]) || []);

    // Prepare all match inserts
    const matchInserts = [];
    for (const match of matches) {
      const homeTeamId = teamNameToId.get(match.homeTeam.name);
      const awayTeamId = teamNameToId.get(match.awayTeam.name);

      if (homeTeamId && awayTeamId) {
        matchInserts.push({
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          match_date: match.utcDate,
          competition: match.competition.name,
          status: match.status.toLowerCase(),
          // Keep upcoming scores as NULL instead of forcing 0-0
          home_score: match.score.fullTime.home ?? null,
          away_score: match.score.fullTime.away ?? null,
          api_match_id: match.id.toString(),
        });
      }
    }

    // Upsert matches (update if exists, insert if not)
    if (matchInserts.length > 0) {
      console.log(`Upserting ${matchInserts.length} matches...`);
      const { error: matchError } = await supabase
        .from('matches')
        .upsert(matchInserts, { onConflict: 'api_match_id' });
      if (matchError) {
        console.error('Error upserting matches:', matchError);
        return new Response(
          JSON.stringify({ error: 'Failed to upsert matches', details: matchError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        teamsProcessed: teamInserts.length,
        matchesUpserted: matchInserts.length,
        message: `Successfully populated ${matchInserts.length} matches for ${dateFrom} to ${dateTo}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-matches function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
