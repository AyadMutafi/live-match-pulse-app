const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PlayerInput {
  name: string;
  team: string;
  position: string;
}

interface FirecrawlResult {
  url: string;
  title: string;
  description: string;
  markdown?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { players } = await req.json() as { players: PlayerInput[] };

    if (!players?.length) {
      return new Response(
        JSON.stringify({ error: 'Players array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const geminiKey = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'GOOGLE_AI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const batch = players.slice(0, 12);
    const results: any[] = [];

    // Process players sequentially to respect rate limits
    for (const player of batch) {
      try {
        console.log(`Searching X.com for: ${player.name} (${player.team})`);

        // Step 1: Firecrawl Search for recent X.com/Twitter posts
        const searchQuery = `${player.name} ${player.team} football fan reaction site:x.com OR site:twitter.com`;
        const searchResp = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 10,
            tbs: 'qdr:w', // last week
            scrapeOptions: { formats: ['markdown'] },
          }),
        });

        let posts: FirecrawlResult[] = [];
        let totalLikes = 0;
        let totalReposts = 0;

        if (searchResp.ok) {
          const searchData = await searchResp.json();
          posts = (searchData.data || []).slice(0, 8);
          console.log(`Found ${posts.length} posts for ${player.name}`);
        } else {
          const errText = await searchResp.text();
          console.error(`Firecrawl search failed for ${player.name}: ${searchResp.status}`, errText);

          if (searchResp.status === 402) {
            return new Response(
              JSON.stringify({ error: 'Firecrawl credits exhausted. Please top up your Firecrawl plan.' }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        // Extract text content from posts
        const postTexts = posts.map((p, i) => {
          const text = p.markdown?.slice(0, 500) || p.description || p.title || '';
          return `[Post ${i + 1}] ${text}`;
        }).join('\n\n');

        // Step 2: Gemini sentiment analysis
        const sentimentPrompt = `Analyze the following social media posts about football player ${player.name} (${player.team}, ${player.position}).

Posts found:
${postTexts || 'No specific posts found. Provide general analysis based on current public perception.'}

Return STRICTLY valid JSON (no markdown, no code blocks):
{
  "name": "${player.name}",
  "team": "${player.team}",
  "position": "${player.position}",
  "score": <fan sentiment score 0-100>,
  "sentimentNormalized": <sentiment score from -1.0 to 1.0>,
  "trend": "rising|falling|stable",
  "tweetsCount": <approximate posts found or estimated>,
  "aiConfidence": <confidence 70-98>,
  "aiSummary": "<2-3 sentence summary of fan sentiment>",
  "avgLikes": <estimated average likes per post>,
  "avgReposts": <estimated average reposts per post>,
  "themes": [
    { "icon": "<emoji>", "label": "<theme>", "count": "<approx count like 1.2K>" }
  ],
  "recentForm": [
    { "match": "<vs opponent>", "emoji": "<sentiment emoji>", "score": <0-100> }
  ],
  "sampleTweets": [
    { "text": "<actual or representative fan reaction>", "sentiment": "<emoji>" }
  ]
}

Provide 2-3 themes, 3-5 recent form entries, and 3 sample tweets.
Use emojis: 🔥(90-100) 😍(70-89) 🙂(50-69) 😐(30-49) 😤(10-29) 💩(0-9).`;

        const geminiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: sentimentPrompt }] }],
              generationConfig: { temperature: 0.5, maxOutputTokens: 2048 },
            }),
          }
        );

        if (!geminiResp.ok) {
          console.error(`Gemini API error for ${player.name}: ${geminiResp.status}`);
          // Add fallback entry
          results.push({
            name: player.name, team: player.team, position: player.position,
            score: 50, sentimentNormalized: 0, trend: 'stable',
            tweetsCount: 0, aiConfidence: 0, aiSummary: 'Analysis unavailable',
            themes: [], recentForm: [], sampleTweets: [],
          });
          continue;
        }

        const geminiData = await geminiResp.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        let parsed: any = null;
        try {
          const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, rawText];
          parsed = JSON.parse(jsonMatch[1]!.trim());
        } catch {
          try {
            const start = rawText.indexOf('{');
            const end = rawText.lastIndexOf('}');
            if (start !== -1 && end !== -1) parsed = JSON.parse(rawText.slice(start, end + 1));
          } catch {
            console.error(`Failed to parse Gemini response for ${player.name}`);
          }
        }

        if (parsed) {
          results.push({
            ...parsed,
            name: player.name,
            team: player.team,
            position: player.position,
            postsSourced: posts.length,
            source: 'firecrawl+gemini',
          });
        } else {
          results.push({
            name: player.name, team: player.team, position: player.position,
            score: 50, sentimentNormalized: 0, trend: 'stable',
            tweetsCount: 0, aiConfidence: 0, aiSummary: 'Analysis unavailable',
            themes: [], recentForm: [], sampleTweets: [],
          });
        }

        // Step 3: Save to Supabase
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        if (supabaseUrl && supabaseKey && parsed) {
          try {
            const league = guessLeague(player.team);
            await fetch(`${supabaseUrl}/rest/v1/player_sentiment_scores`, {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({
                player_name: player.name,
                team: player.team,
                league,
                position: player.position,
                sentiment_score: parsed.sentimentNormalized ?? ((parsed.score - 50) / 50),
                posts_analyzed: posts.length,
                avg_likes: parsed.avgLikes || 0,
                avg_reposts: parsed.avgReposts || 0,
                sample_posts: (parsed.sampleTweets || []).slice(0, 3),
                source: 'firecrawl',
              }),
            });
            console.log(`Saved sentiment for ${player.name} to DB`);
          } catch (dbErr) {
            console.error(`DB save failed for ${player.name}:`, dbErr);
          }
        }

        // Rate limit: 3-second delay between players
        await new Promise(r => setTimeout(r, 3000));

      } catch (playerErr) {
        console.error(`Error processing ${player.name}:`, playerErr);
        results.push({
          name: player.name, team: player.team, position: player.position,
          score: 50, sentimentNormalized: 0, trend: 'stable',
          tweetsCount: 0, aiConfidence: 0, aiSummary: 'Error during analysis',
          themes: [], recentForm: [], sampleTweets: [],
        });
      }
    }

    return new Response(JSON.stringify({
      players: results,
      analyzedAt: new Date().toISOString(),
      source: 'firecrawl+gemini',
      playersProcessed: results.length,
    }), {
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

function guessLeague(team: string): string {
  const laLiga = ['Barcelona', 'Real Madrid', 'Atletico', 'Sevilla', 'Valencia', 'Villarreal', 'Real Betis', 'Athletic'];
  const pl = ['Man City', 'Liverpool', 'Arsenal', 'Chelsea', 'Man United', 'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Brighton'];
  const serieA = ['Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina'];

  if (laLiga.some(t => team.includes(t))) return 'La Liga';
  if (pl.some(t => team.includes(t))) return 'Premier League';
  if (serieA.some(t => team.includes(t))) return 'Serie A';
  return 'Other';
}
