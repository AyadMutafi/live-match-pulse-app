import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { matchId } = await req.json();

    // Fetch the match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, league, country),
        away_team:teams!matches_away_team_id_fkey(id, name, league, country)
      `)
      .eq('id', matchId)
      .single();

    if (matchError) throw matchError;

    // Fetch recent matches for both teams
    const { data: homeHistory, error: homeError } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${match.home_team_id},away_team_id.eq.${match.home_team_id}`)
      .eq('status', 'finished')
      .order('match_date', { ascending: false })
      .limit(5);

    const { data: awayHistory, error: awayError } = await supabase
      .from('matches')
      .select('*')
      .or(`home_team_id.eq.${match.away_team_id},away_team_id.eq.${match.away_team_id}`)
      .eq('status', 'finished')
      .order('match_date', { ascending: false })
      .limit(5);

    if (homeError || awayError) throw homeError || awayError;

    // Calculate recent form
    const calculateForm = (matches: any[], teamId: string) => {
      return matches.map(m => {
        const isHome = m.home_team_id === teamId;
        const teamScore = isHome ? m.home_score : m.away_score;
        const oppScore = isHome ? m.away_score : m.home_score;
        return teamScore > oppScore ? 'W' : teamScore === oppScore ? 'D' : 'L';
      }).join('');
    };

    const homeForm = calculateForm(homeHistory || [], match.home_team_id);
    const awayForm = calculateForm(awayHistory || [], match.away_team_id);

    // Use AI to predict match outcome
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a football match prediction expert. Analyze team form and provide realistic predictions with probabilities.',
          },
          {
            role: 'user',
            content: `Predict the outcome of:\n${match.home_team.name} (Recent form: ${homeForm}) vs ${match.away_team.name} (Recent form: ${awayForm})\n\nProvide:\n1) Win probabilities (home/draw/away as percentages)\n2) Predicted score\n3) Confidence level (0-100)\n4) 3 key insights\n\nFormat as JSON: {homeWin: number, draw: number, awayWin: number, predictedScore: string, confidence: number, insights: string[]}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const prediction = aiData.choices[0].message.content;

    // Try to parse JSON from AI response
    let parsedPrediction;
    try {
      const jsonMatch = prediction.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPrediction = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Could not parse prediction JSON, using raw response');
    }

    return new Response(
      JSON.stringify({
        matchId,
        homeTeam: match.home_team.name,
        awayTeam: match.away_team.name,
        homeForm,
        awayForm,
        prediction: parsedPrediction || prediction,
        rawPrediction: prediction,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error predicting match:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});