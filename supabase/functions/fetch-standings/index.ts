import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LEAGUE_CODES: Record<string, string> = {
  'PL': 'Premier League',
  'PD': 'La Liga',
  'SA': 'Serie A',
  'BL1': 'Bundesliga',
  'FL1': 'Ligue 1',
  'PPL': 'Primeira Liga',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const footballDataApiKey = Deno.env.get('FOOTBALL_DATA_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const allInserts: any[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    // Football season spans two years; if we're before August, current season started last year
    const season = currentMonth < 7 ? currentYear - 1 : currentYear;

    for (const [code, name] of Object.entries(LEAGUE_CODES)) {
      try {
        console.log(`Fetching standings for ${name} (${code})...`);
        const response = await fetch(
          `https://api.football-data.org/v4/competitions/${code}/standings?season=${season}`,
          { headers: { 'X-Auth-Token': footballDataApiKey } }
        );

        if (!response.ok) {
          console.error(`Failed to fetch ${code}: ${response.status}`);
          await response.text(); // consume body
          continue;
        }

        const data = await response.json();
        const table = data.standings?.[0]?.table || [];

        for (const entry of table) {
          allInserts.push({
            league_code: code,
            league_name: name,
            season: season,
            team_name: entry.team.name,
            team_short_name: entry.team.tla || entry.team.shortName,
            position: entry.position,
            played: entry.playedGames,
            won: entry.won,
            drawn: entry.draw,
            lost: entry.lost,
            goals_for: entry.goalsFor,
            goals_against: entry.goalsAgainst,
            goal_difference: entry.goalDifference,
            points: entry.points,
            form: entry.form || null,
          });
        }

        // Respect rate limit: 10 requests/min for free tier
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (err) {
        console.error(`Error fetching ${code}:`, err);
      }
    }

    if (allInserts.length > 0) {
      console.log(`Upserting ${allInserts.length} standings rows...`);
      const { error } = await supabase
        .from('league_standings')
        .upsert(allInserts, { onConflict: 'league_code,season,team_name' });

      if (error) {
        console.error('Error upserting standings:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to upsert standings', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        standingsUpserted: allInserts.length,
        season,
        leagues: Object.keys(LEAGUE_CODES),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-standings function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
