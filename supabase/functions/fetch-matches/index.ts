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

    // Fetch recent matches (last 10 days) - free tier supports this better
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    
    const dateFrom = tenDaysAgo.toISOString().split('T')[0];
    const dateTo = today.toISOString().split('T')[0];
    
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

    const processedTeams = new Set<number>();
    const teamInserts = [];
    const matchInserts = [];

    for (const match of matches) {
      // Process home team
      if (!processedTeams.has(match.homeTeam.id)) {
        const { data: existingTeam } = await supabase
          .from('teams')
          .select('id')
          .eq('name', match.homeTeam.name)
          .maybeSingle();

        if (!existingTeam) {
          teamInserts.push({
            name: match.homeTeam.name,
            league: match.competition.name,
            country: match.homeTeam.tla || 'Unknown',
            colors: { primary: '#000000', secondary: '#FFFFFF' },
            social_handles: { twitter: '', instagram: '' },
          });
        }
        processedTeams.add(match.homeTeam.id);
      }

      // Process away team
      if (!processedTeams.has(match.awayTeam.id)) {
        const { data: existingTeam } = await supabase
          .from('teams')
          .select('id')
          .eq('name', match.awayTeam.name)
          .maybeSingle();

        if (!existingTeam) {
          teamInserts.push({
            name: match.awayTeam.name,
            league: match.competition.name,
            country: match.awayTeam.tla || 'Unknown',
            colors: { primary: '#000000', secondary: '#FFFFFF' },
            social_handles: { twitter: '', instagram: '' },
          });
        }
        processedTeams.add(match.awayTeam.id);
      }
    }

    // Insert teams
    if (teamInserts.length > 0) {
      console.log(`Inserting ${teamInserts.length} teams...`);
      const { error: teamError } = await supabase.from('teams').insert(teamInserts);
      if (teamError) {
        console.error('Error inserting teams:', teamError);
      }
    }

    // Now process matches
    for (const match of matches) {
      // Get team IDs
      const { data: homeTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('name', match.homeTeam.name)
        .single();

      const { data: awayTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('name', match.awayTeam.name)
        .single();

      if (homeTeam && awayTeam) {
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('api_match_id', match.id.toString())
          .maybeSingle();

        if (!existingMatch) {
          matchInserts.push({
            home_team_id: homeTeam.id,
            away_team_id: awayTeam.id,
            match_date: match.utcDate,
            competition: match.competition.name,
            status: match.status.toLowerCase(),
            home_score: match.score.fullTime.home || 0,
            away_score: match.score.fullTime.away || 0,
            api_match_id: match.id.toString(),
          });
        }
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
        message: `Successfully populated ${matchInserts.length} matches from last 10 days`,
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
