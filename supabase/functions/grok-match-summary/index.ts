const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs for analysis
const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface MatchSummaryRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  status: 'scheduled' | 'live' | 'finished';
  posts: Array<{
    content: string;
    author?: string;
    timestamp?: string;
    platform?: string;
  }>;
}

interface MatchSummaryResponse {
  matchId: string;
  summary: string;
  keyMoments: string[];
  viralHighlights: string[];
  controversyThemes: string[];
  fanMood: {
    homeTeam: { score: number; emoji: string; description: string };
    awayTeam: { score: number; emoji: string; description: string };
  };
  talkingPoints: string[];
  updatedAt: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      console.error('XAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Grok API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: MatchSummaryRequest = await req.json();
    const { matchId, homeTeam, awayTeam, homeScore, awayScore, minute, status, posts } = requestData;

    // Validate that at least one team is a target club
    const isTargetMatch = TARGET_CLUBS.includes(homeTeam) || TARGET_CLUBS.includes(awayTeam);
    if (!isTargetMatch) {
      return new Response(
        JSON.stringify({ error: 'Match must involve at least one target club' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating match summary for ${homeTeam} vs ${awayTeam} (${status})`);

    const matchContext = status === 'live' 
      ? `LIVE MATCH - ${minute}' minute: ${homeTeam} ${homeScore ?? 0} - ${awayScore ?? 0} ${awayTeam}`
      : status === 'finished'
      ? `FULL TIME: ${homeTeam} ${homeScore ?? 0} - ${awayScore ?? 0} ${awayTeam}`
      : `UPCOMING: ${homeTeam} vs ${awayTeam}`;

    const systemPrompt = `You are an expert football journalist and social media analyst specializing in fan sentiment for top European clubs.

Your task is to create a real-time match narrative summary (200-300 words) based on fan social media reactions.

Focus on these clubs: ${TARGET_CLUBS.join(', ')}

For your summary:
1. Capture the emotional pulse of both fanbases
2. Highlight viral moments and trending discussions
3. Identify any controversy or heated debates
4. Note key talking points (tactical, player performances, referee decisions)
5. Use engaging, punchy language suitable for a live blog

Return JSON with this exact structure:
{
  "summary": "200-300 word narrative summary...",
  "keyMoments": ["moment 1", "moment 2", "moment 3"],
  "viralHighlights": ["viral post/moment 1", "viral post/moment 2"],
  "controversyThemes": ["controversy 1", "controversy 2"],
  "fanMood": {
    "homeTeam": { "score": 0-100, "emoji": "😤", "description": "short description" },
    "awayTeam": { "score": 0-100, "emoji": "🎉", "description": "short description" }
  },
  "talkingPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}`;

    const userPrompt = `Generate a match summary for:
${matchContext}

Based on these ${posts.length} fan reactions:
${posts.slice(0, 50).map((p, i) => `[${i + 1}] ${p.content}`).join('\n')}

Create an engaging narrative summary capturing the fan atmosphere and key moments.`;

    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', grokResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate match summary with Grok' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const grokData = await grokResponse.json();
    const responseText = grokData.choices[0].message.content;

    // Parse the JSON response
    let summary: MatchSummaryResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = {
          matchId,
          summary: parsed.summary || 'Match summary unavailable.',
          keyMoments: parsed.keyMoments || [],
          viralHighlights: parsed.viralHighlights || [],
          controversyThemes: parsed.controversyThemes || [],
          fanMood: parsed.fanMood || {
            homeTeam: { score: 50, emoji: '😐', description: 'Neutral' },
            awayTeam: { score: 50, emoji: '😐', description: 'Neutral' },
          },
          talkingPoints: parsed.talkingPoints || [],
          updatedAt: new Date().toISOString(),
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', parseError);
      // Fallback summary
      summary = {
        matchId,
        summary: `${homeTeam} vs ${awayTeam} is generating significant buzz on social media. Fans from both sides are actively engaging with the match, sharing their reactions and opinions. ${status === 'live' ? `The current score is ${homeScore}-${awayScore}.` : ''} Stay tuned for more updates.`,
        keyMoments: [],
        viralHighlights: [],
        controversyThemes: [],
        fanMood: {
          homeTeam: { score: 50, emoji: '😐', description: 'Mixed reactions' },
          awayTeam: { score: 50, emoji: '😐', description: 'Mixed reactions' },
        },
        talkingPoints: ['Match atmosphere', 'Team performance', 'Fan reactions'],
        updatedAt: new Date().toISOString(),
      };
    }

    console.log('Match summary generated:', summary.matchId);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grok-match-summary:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
