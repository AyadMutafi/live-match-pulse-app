import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const footballDataApiKey = Deno.env.get('FOOTBALL_DATA_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching matches from football-data.org API...');

    // Fetch matches for the week of Nov 1-7, 2025
    const dateFrom = '2025-11-01';
    const dateTo = '2025-11-07';
    
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
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Football Data API error: ${response.status} ${response.statusText} - ${errorText}`);
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
          home_score: match.score.fullTime.home || 0,
          away_score: match.score.fullTime.away || 0,
          api_match_id: match.id.toString(),
        });
      }
    }

    // Insert matches
    if (matchInserts.length > 0) {
      console.log(`Inserting ${matchInserts.length} matches...`);
      const { error: matchError } = await supabase.from('matches').insert(matchInserts);
      if (matchError) {
        console.error('Error inserting matches:', matchError);
        throw matchError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        teamsProcessed: teamInserts.length,
        matchesInserted: matchInserts.length,
        message: `Successfully populated ${matchInserts.length} matches for Nov 1-7, 2025`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-matches function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
