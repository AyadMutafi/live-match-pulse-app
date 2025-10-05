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

    const { weekStart, weekEnd, competition } = await req.json();

    // Fetch matches for the week and competition
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, league, country),
        away_team:teams!matches_away_team_id_fkey(id, name, league, country)
      `)
      .gte('match_date', weekStart)
      .lte('match_date', weekEnd)
      .eq('status', 'finished');
    
    // Filter by competition if provided
    if (competition) {
      query = query.eq('competition', competition);
    }
    
    const { data: matches, error: matchError } = await query.order('match_date', { ascending: true });

    if (matchError) throw matchError;

    if (!matches || matches.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No finished matches found for this week' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch sentiment data for these matches
    const matchIds = matches.map(m => m.id);
    const { data: sentimentData, error: sentimentError } = await supabase
      .from('social_posts')
      .select('match_id, team_id, sentiment_score, emotions')
      .in('match_id', matchIds);

    if (sentimentError) throw sentimentError;

    // Prepare match summaries for AI
    const matchSummaries = matches.map(m => {
      const homeTeam = m.home_team;
      const awayTeam = m.away_team;
      const sentiment = sentimentData?.filter(s => s.match_id === m.id) || [];
      const avgSentiment = sentiment.length > 0
        ? sentiment.reduce((sum, s) => sum + (s.sentiment_score || 0), 0) / sentiment.length
        : 0;

      return `${homeTeam.name} ${m.home_score}-${m.away_score} ${awayTeam.name} (Fan sentiment: ${(avgSentiment * 100).toFixed(0)}% positive)`;
    });

    // Use AI to generate Team of the Week
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
            content: 'You are a football analyst. Based on match results and fan sentiment, select a Team of the Week in a 4-3-3 formation with 11 players. Provide realistic player names and brief justifications.',
          },
          {
            role: 'user',
            content: `Based on these match results:\n${matchSummaries.join('\n')}\n\nGenerate a Team of the Week in a 4-3-3 formation. Return ONLY a valid JSON object with this exact structure:
{
  "formation": "4-3-3",
  "players": [
    {"position": "GK", "name": "Player Name", "team": "Team Name", "rating": 9.5, "reason": "Brief reason"},
    {"position": "LB", "name": "Player Name", "team": "Team Name", "rating": 8.5, "reason": "Brief reason"},
    {"position": "CB", "name": "Player Name", "team": "Team Name", "rating": 8.7, "reason": "Brief reason"},
    {"position": "CB", "name": "Player Name", "team": "Team Name", "rating": 8.8, "reason": "Brief reason"},
    {"position": "RB", "name": "Player Name", "team": "Team Name", "rating": 8.3, "reason": "Brief reason"},
    {"position": "LM", "name": "Player Name", "team": "Team Name", "rating": 8.9, "reason": "Brief reason"},
    {"position": "CM", "name": "Player Name", "team": "Team Name", "rating": 9.0, "reason": "Brief reason"},
    {"position": "RM", "name": "Player Name", "team": "Team Name", "rating": 8.6, "reason": "Brief reason"},
    {"position": "LW", "name": "Player Name", "team": "Team Name", "rating": 9.2, "reason": "Brief reason"},
    {"position": "ST", "name": "Player Name", "team": "Team Name", "rating": 9.5, "reason": "Brief reason"},
    {"position": "RW", "name": "Player Name", "team": "Team Name", "rating": 9.1, "reason": "Brief reason"}
  ]
}
Ratings should be between 7.0 and 10.0. No markdown, no code blocks, just the JSON.`,
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
    const teamOfWeekContent = aiData.choices[0].message.content;
    
    // Parse the JSON from AI response
    let teamOfWeek;
    try {
      // Remove markdown code blocks if present
      const cleanContent = teamOfWeekContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      teamOfWeek = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', teamOfWeekContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(
      JSON.stringify({
        weekStart,
        weekEnd,
        matchesAnalyzed: matches.length,
        teamOfWeek,
        matchSummaries,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating team of week:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});