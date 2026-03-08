const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PlayerInput {
  name: string;
  team: string;
  position: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { players } = await req.json() as { players: PlayerInput[] };

    if (!players || !Array.isArray(players) || players.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Players array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GOOGLE_AI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const batch = players.slice(0, 15);
    const playerList = batch.map(p => `${p.name} (${p.team}, ${p.position})`).join(', ');

    const prompt = `Search the web for the latest fan reactions, tweets, and social media sentiment about these football/soccer players from the last 48 hours: ${playerList}

For EACH player, analyze fan sentiment from X.com (Twitter), Reddit, and fan forums.

Return STRICTLY valid JSON (no markdown, no code blocks):
{
  "players": [
    {
      "name": "<player name>",
      "team": "<team>",
      "position": "<position>",
      "score": <sentiment score 0-100>,
      "trend": "rising|falling|stable",
      "tweetsCount": <approximate number of posts found>,
      "aiConfidence": <confidence 70-98>,
      "aiSummary": "<2-3 sentence summary of fan sentiment>",
      "themes": [
        { "icon": "<emoji>", "label": "<theme>", "count": "<approx count like 1.2K>" }
      ],
      "recentForm": [
        { "match": "<vs opponent>", "emoji": "<sentiment emoji>", "score": <0-100> }
      ],
      "sampleTweets": [
        { "text": "<authentic sounding fan reaction>", "sentiment": "<emoji>" }
      ]
    }
  ],
  "analyzedAt": "<ISO timestamp>",
  "source": "gemini_web_search"
}

For each player provide 2-3 themes, 3-5 recent form entries, and 3 sample tweets. Make reactions sound authentic. Use emojis from this scale: 🔥(90-100) 😍(70-89) 🙂(50-69) 😐(30-49) 😤(10-29) 💩(0-9).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        console.error('Failed to parse player sentiment response');
        parsed = { players: [], source: "fallback" };
      }
    }

    return new Response(JSON.stringify({
      players: parsed.players || [],
      analyzedAt: parsed.analyzedAt || new Date().toISOString(),
      source: parsed.source || "gemini_web_search",
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
