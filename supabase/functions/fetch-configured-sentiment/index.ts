import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active monitored matches
    const { data: activeMonitoring } = await supabase
      .from('match_monitoring')
      .select('*, matches(*, home_team:teams!matches_home_team_id_fkey(id, name), away_team:teams!matches_away_team_id_fkey(id, name))')
      .eq('active', true);

    if (!activeMonitoring || activeMonitoring.length === 0) {
      return new Response(JSON.stringify({ message: 'No active matches', processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let processed = 0;

    for (const mon of activeMonitoring) {
      const match = mon.matches;
      if (!match) continue;

      const homeTeamId = match.home_team?.id;
      const awayTeamId = match.away_team?.id;
      const homeName = match.home_team?.name || 'Home';
      const awayName = match.away_team?.name || 'Away';

      // Get configured sources for both teams
      const { data: homeSources } = await supabase
        .from('data_sources').select('*').eq('team_id', homeTeamId).eq('active', true);
      const { data: awaySources } = await supabase
        .from('data_sources').select('*').eq('team_id', awayTeamId).eq('active', true);

      const homeSearchTerms = (homeSources || []).map((s: any) => s.hashtag || `@${s.handle}`).join(', ');
      const awaySearchTerms = (awaySources || []).map((s: any) => s.hashtag || `@${s.handle}`).join(', ');

      // Single Gemini call for both teams
      const prompt = `Search the web for very recent fan reactions about the football match "${homeName} vs ${awayName}".

Focus on these specific sources for ${homeName} fans: ${homeSearchTerms || homeName}
Focus on these specific sources for ${awayName} fans: ${awaySearchTerms || awayName}

Look on X.com (Twitter), Reddit, and fan forums from the last 24-48 hours.

Return STRICTLY valid JSON (no markdown, no code blocks):
{
  "home": {
    "sentiment_score": <0-100>,
    "emoji": "<🔥 or 😍 or 🙂 or 😐 or 😤 or 💩>",
    "breakdown": {"positive": <0-100>, "negative": <0-100>, "neutral": <0-100>},
    "themes": ["theme1", "theme2", "theme3"],
    "sample_tweets": [{"text": "tweet text", "sentiment": "Positive|Negative|Neutral"}],
    "total_posts": <number>
  },
  "away": {
    "sentiment_score": <0-100>,
    "emoji": "<🔥 or 😍 or 🙂 or 😐 or 😤 or 💩>",
    "breakdown": {"positive": <0-100>, "negative": <0-100>, "neutral": <0-100>},
    "themes": ["theme1", "theme2", "theme3"],
    "sample_tweets": [{"text": "tweet text", "sentiment": "Positive|Negative|Neutral"}],
    "total_posts": <number>
  }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ googleSearch: {} }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
        }
      );

      if (!response.ok) {
        console.error(`Gemini error for match ${match.id}: ${response.status}`);
        continue;
      }

      const aiData = await response.json();
      const rawContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

      let parsed: any;
      try {
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, rawContent];
        parsed = JSON.parse(jsonMatch[1]!.trim());
      } catch {
        try {
          const jsonStart = rawContent.indexOf('{');
          const jsonEnd = rawContent.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            parsed = JSON.parse(rawContent.slice(jsonStart, jsonEnd + 1));
          } else continue;
        } catch { continue; }
      }

      const home = parsed.home || {};
      const away = parsed.away || {};

      await supabase.from('sentiment_snapshots').insert({
        match_id: match.id,
        home_sentiment: home.sentiment_score || 50,
        home_emoji: home.emoji || '🙂',
        home_breakdown: home.breakdown || {},
        home_themes: home.themes || [],
        home_sample_tweets: home.sample_tweets || [],
        away_sentiment: away.sentiment_score || 50,
        away_emoji: away.emoji || '🙂',
        away_breakdown: away.breakdown || {},
        away_themes: away.themes || [],
        away_sample_tweets: away.sample_tweets || [],
        tweets_analyzed: (home.total_posts || 0) + (away.total_posts || 0),
        ai_confidence: Math.min(95, Math.round(((home.total_posts || 0) + (away.total_posts || 0)) / 2)),
      });

      processed++;

      // Rate limit: wait 3s between matches
      if (processed < activeMonitoring.length) {
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    return new Response(JSON.stringify({ processed, total: activeMonitoring.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
