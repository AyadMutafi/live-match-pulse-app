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
    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!geminiApiKey) throw new Error('GOOGLE_AI_API_KEY is not configured');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recent finished matches with team names
    const { data: matches, error: matchErr } = await supabase
      .from('matches')
      .select('id, home_score, away_score, match_date, competition, home_team_id, away_team_id')
      .eq('status', 'finished')
      .order('match_date', { ascending: false })
      .limit(15);

    if (matchErr) throw matchErr;
    if (!matches || matches.length === 0) {
      return new Response(JSON.stringify({ message: 'No finished matches found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get team names
    const teamIds = [...new Set(matches.flatMap(m => [m.home_team_id, m.away_team_id]))];
    const { data: teams } = await supabase.from('teams').select('id, name').in('id', teamIds);
    const teamMap = new Map((teams || []).map(t => [t.id, t.name]));

    // Build match summaries for AI
    const matchSummaries = matches.map(m => {
      const home = teamMap.get(m.home_team_id) || 'Unknown';
      const away = teamMap.get(m.away_team_id) || 'Unknown';
      return `${home} ${m.home_score}-${m.away_score} ${away} (${m.competition}, ${new Date(m.match_date).toLocaleDateString()})`;
    }).join('\n');

    console.log(`Generating AI social posts for ${matches.length} recent matches...`);

    const prompt = `You are a social media content simulator for a football sentiment tracking app. Generate realistic fan reactions to real match results. Each post should feel authentic — use football slang, emojis, hashtags, and varied tones (excited, frustrated, analytical, humorous). Mix platforms (Twitter, Reddit, Instagram style).

Return a JSON object with a "posts" array containing exactly 30 objects with these fields:
- author_handle (string, realistic username)
- content (string, 20-150 chars, authentic fan voice)
- platform (string: "twitter", "instagram", or "facebook")
- sentiment_score (number 0-100, where 100=very positive)
- match_index (number, index of the match this post is about)

Vary sentiment based on results (winners get positive posts, losers get negative/frustrated posts, draws get mixed). Include some neutral analytical posts too.

Here are the recent match results:
${matchSummaries}

IMPORTANT: Return ONLY the JSON object with the "posts" array. No other text.`;

    // Try Gemini API first, fallback to Lovable AI Gateway
    let generatedPosts: any[];

    // Attempt 1: Direct Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
      }),
    });

    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textContent) {
        const parsed = JSON.parse(textContent);
        generatedPosts = parsed.posts || parsed;
        console.log(`Gemini API generated ${generatedPosts.length} posts`);
      } else {
        throw new Error('Empty Gemini response');
      }
    } else {
      // Fallback: Lovable AI Gateway
      console.log(`Gemini API returned ${geminiResponse.status}, falling back to Lovable AI Gateway...`);
      const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
      if (!lovableApiKey) throw new Error('Both Gemini and Lovable AI unavailable');

      const fallbackResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${lovableApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a JSON generator. Return only valid JSON.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!fallbackResponse.ok) {
        const errText = await fallbackResponse.text();
        console.error('Lovable AI fallback error:', fallbackResponse.status, errText);
        if (fallbackResponse.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limited, try again later' }), {
            status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error(`AI API error: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const content = fallbackData.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content in fallback response');
      // Extract JSON from potential markdown code blocks
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      generatedPosts = parsed.posts || parsed;
      console.log(`Lovable AI fallback generated ${generatedPosts.length} posts`);
    }

    if (!Array.isArray(generatedPosts) || generatedPosts.length === 0) {
      throw new Error('Invalid AI response format');
    }

    console.log(`Total posts to insert: ${generatedPosts.length}`);

    // Map to DB format and insert
    const now = new Date();
    const dbPosts = generatedPosts.map((p: any, i: number) => {
      const match = matches[Math.min(p.match_index, matches.length - 1)];
      // Spread posted_at across last few hours for realism
      const postedAt = new Date(now.getTime() - (i * 3 + Math.random() * 10) * 60000);
      // sentiment_score column is numeric(3,2) so scale 0-100 to 0.00-9.99
      const scaledScore = Math.min(9.99, Math.max(0, (p.sentiment_score / 100) * 9.99));
      return {
        post_id: `ai-gen-${now.getTime()}-${i}`,
        author_handle: p.author_handle,
        content: p.content,
        platform: p.platform,
        sentiment_score: parseFloat(scaledScore.toFixed(2)),
        match_id: match.id,
        team_id: p.sentiment_score >= 50 ? match.home_team_id : match.away_team_id,
        posted_at: postedAt.toISOString(),
        processed_at: now.toISOString(),
        engagement_metrics: {
          likes: Math.floor(Math.random() * 5000) + 50,
          shares: Math.floor(Math.random() * 800) + 10,
          views: Math.floor(Math.random() * 80000) + 500,
        },
        emotions: {
          source: 'ai-generated',
          based_on: 'match-results',
        },
      };
    });

    const { error: insertErr } = await supabase.from('social_posts').insert(dbPosts);
    if (insertErr) {
      console.error('Insert error:', insertErr);
      throw insertErr;
    }

    console.log(`Inserted ${dbPosts.length} AI-generated social posts`);

    return new Response(JSON.stringify({
      success: true,
      postsGenerated: dbPosts.length,
      matchesCovered: matches.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating social posts:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate posts' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
