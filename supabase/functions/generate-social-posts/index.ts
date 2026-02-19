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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
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

    // Use Gemini to generate realistic fan reactions
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
            content: `You are a social media content simulator for a football sentiment tracking app. Generate realistic fan reactions to real match results. Each post should feel authentic — use football slang, emojis, hashtags, and varied tones (excited, frustrated, analytical, humorous). Mix platforms (Twitter, Reddit, Instagram style). Return a JSON array of objects with these fields:
- author_handle (string, realistic username)
- content (string, 20-150 chars, authentic fan voice)
- platform (string: "twitter", "instagram", or "facebook")
- sentiment_score (number 0-100, where 100=very positive)
- match_index (number, index of the match this post is about)

Generate exactly 30 posts spread across the matches. Vary sentiment based on results (winners get positive posts, losers get negative/frustrated posts, draws get mixed). Include some neutral analytical posts too.`
          },
          {
            role: 'user',
            content: `Generate fan reactions for these recent match results:\n${matchSummaries}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_posts",
              description: "Generate realistic social media fan posts",
              parameters: {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        author_handle: { type: "string" },
                        content: { type: "string" },
                        platform: { type: "string", enum: ["twitter", "instagram", "facebook"] },
                        sentiment_score: { type: "number" },
                        match_index: { type: "number" }
                      },
                      required: ["author_handle", "content", "platform", "sentiment_score", "match_index"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["posts"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_posts" } }
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited, try again later' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('No tool call in AI response');

    const { posts: generatedPosts } = JSON.parse(toolCall.function.arguments);
    console.log(`AI generated ${generatedPosts.length} posts`);

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
