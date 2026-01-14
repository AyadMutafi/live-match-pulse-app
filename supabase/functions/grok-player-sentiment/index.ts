const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs and notable players
const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface PlayerSentimentRequest {
  playerName: string;
  club: string;
  posts: Array<{
    content: string;
    author?: string;
    timestamp?: string;
    platform?: string;
  }>;
  includeTopicBreakdown?: boolean;
}

interface PlayerSentimentResponse {
  player: {
    name: string;
    club: string;
  };
  overallRating: {
    score: number; // 0-10
    label: string;
    emoji: string;
  };
  topicBreakdown: Array<{
    topic: string;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    sampleComments: string[];
  }>;
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    vsLastMatch: number;
    momentum: string;
  };
  fanVerdicts: {
    praises: string[];
    criticisms: string[];
    debates: string[];
  };
  highlightQuotes: string[];
  analysisDate: string;
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

    const requestData: PlayerSentimentRequest = await req.json();
    const { playerName, club, posts, includeTopicBreakdown = true } = requestData;

    if (!playerName || !club) {
      return new Response(
        JSON.stringify({ error: 'Player name and club are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!TARGET_CLUBS.includes(club)) {
      return new Response(
        JSON.stringify({ 
          error: 'Club must be one of the target clubs',
          availableClubs: TARGET_CLUBS 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Posts array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing sentiment for ${playerName} (${club}) - ${posts.length} posts`);

    const systemPrompt = `You are an expert football analyst specializing in player sentiment analysis for ${club}.

Analyze social media posts mentioning ${playerName} and provide detailed player-specific sentiment analysis.

Consider these aspects:
1. Finishing/Goalscoring
2. Passing/Creativity
3. Defending/Tackling
4. Work Rate/Effort
5. Leadership
6. Positioning/Movement
7. Speed/Athleticism
8. Technical Skills
9. Big Game Performance
10. Attitude/Professionalism

Return JSON with this exact structure:
{
  "overallRating": {
    "score": 0-10 (one decimal),
    "label": "World Class/Excellent/Good/Average/Poor/Struggling",
    "emoji": "appropriate emoji"
  },
  "topicBreakdown": [
    {
      "topic": "Finishing",
      "positivePercent": 0-100,
      "negativePercent": 0-100,
      "neutralPercent": 0-100,
      "sampleComments": ["example fan comment"]
    }
  ],
  "trend": {
    "direction": "improving/declining/stable",
    "vsLastMatch": percentage change estimate,
    "momentum": "brief description of trend"
  },
  "fanVerdicts": {
    "praises": ["what fans love about player"],
    "criticisms": ["what fans criticize"],
    "debates": ["topics fans disagree on"]
  },
  "highlightQuotes": ["notable fan quotes about player"]
}`;

    const userPrompt = `Analyze these ${posts.length} social media posts about ${playerName} (${club}):

${posts.slice(0, 60).map((p, i) => `[${i + 1}] ${p.content}`).join('\n')}

Provide comprehensive player sentiment analysis with topic breakdown.`;

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
        temperature: 0.4,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', grokResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze player sentiment with Grok' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const grokData = await grokResponse.json();
    const responseText = grokData.choices[0].message.content;

    // Parse the JSON response
    let analysis: PlayerSentimentResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = {
          player: { name: playerName, club },
          overallRating: parsed.overallRating || { score: 5.0, label: 'Average', emoji: '😐' },
          topicBreakdown: includeTopicBreakdown ? (parsed.topicBreakdown || []) : [],
          trend: parsed.trend || {
            direction: 'stable',
            vsLastMatch: 0,
            momentum: 'Consistent fan opinion',
          },
          fanVerdicts: parsed.fanVerdicts || {
            praises: [],
            criticisms: [],
            debates: [],
          },
          highlightQuotes: (parsed.highlightQuotes || []).slice(0, 5),
          analysisDate: new Date().toISOString(),
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', parseError);
      analysis = {
        player: { name: playerName, club },
        overallRating: { score: 5.0, label: 'Average', emoji: '😐' },
        topicBreakdown: [],
        trend: {
          direction: 'stable',
          vsLastMatch: 0,
          momentum: 'Analysis unavailable',
        },
        fanVerdicts: { praises: [], criticisms: [], debates: [] },
        highlightQuotes: [],
        analysisDate: new Date().toISOString(),
      };
    }

    console.log('Player sentiment analysis complete:', playerName, analysis.overallRating.score);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grok-player-sentiment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
