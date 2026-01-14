import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface PlayerSentimentRequest {
  playerName: string;
  club: string;
  posts: Array<{ content: string; platform: string; timestamp?: string }>;
}

interface PlayerSentimentResponse {
  playerName: string;
  club: string;
  overallRating: number;
  sentimentLabel: string;
  topicBreakdown: Array<{
    topic: string;
    positivePercentage: number;
    negativePercentage: number;
    sampleComments: string[];
  }>;
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    changePercent: number;
  };
  fanOpinions: {
    praiseCount: number;
    criticismCount: number;
    neutralCount: number;
    topPraises: string[];
    topCriticisms: string[];
  };
  comparisonToTeammates: {
    ranking: number;
    totalPlayers: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const { playerName, club, posts }: PlayerSentimentRequest = await req.json();

    if (!playerName || !club) {
      return new Response(
        JSON.stringify({ error: 'playerName and club are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!TARGET_CLUBS.some(c => c.toLowerCase().includes(club.toLowerCase()) || club.toLowerCase().includes(c.toLowerCase()))) {
      return new Response(
        JSON.stringify({ error: `Club must be one of: ${TARGET_CLUBS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing sentiment for ${playerName} (${club})`);

    const systemPrompt = `You are an expert football/soccer player sentiment analyst. Analyze fan opinions about a specific player.

Target clubs: ${TARGET_CLUBS.join(', ')}

Analyze posts mentioning the player and return a JSON object:
{
  "overallRating": 7.5,
  "sentimentLabel": "Positive",
  "topicBreakdown": [
    {
      "topic": "Finishing",
      "positivePercentage": 85,
      "negativePercentage": 15,
      "sampleComments": ["Great goal scorer", "Clinical in front of goal"]
    },
    {
      "topic": "Work Rate",
      "positivePercentage": 45,
      "negativePercentage": 55,
      "sampleComments": ["Needs to track back more"]
    }
  ],
  "trend": {
    "direction": "improving",
    "changePercent": 12
  },
  "fanOpinions": {
    "praiseCount": 25,
    "criticismCount": 10,
    "neutralCount": 5,
    "topPraises": ["World class finisher", "Great positioning"],
    "topCriticisms": ["Lazy defending", "Inconsistent"]
  },
  "comparisonToTeammates": {
    "ranking": 3,
    "totalPlayers": 11
  }
}

Topics to analyze: Finishing, Passing, Dribbling, Defending, Work Rate, Leadership, Consistency, Big Game Performance, Fitness, Value for Money`;

    const postsText = (posts || []).slice(0, 40).map((p, idx) => 
      `[${idx}] [${p.platform}] ${p.content}`
    ).join('\n');

    const userPrompt = `Analyze fan sentiment for ${playerName} who plays for ${club}:

Posts mentioning ${playerName}:
${postsText || 'No specific posts available. Provide a general analysis based on common fan perceptions.'}`;

    const model = 'gemini-2.0-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.85,
            maxOutputTokens: 2500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiData = await response.json();
    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let analysisData: Partial<PlayerSentimentResponse> = {
      overallRating: 5.0,
      sentimentLabel: 'Neutral',
      topicBreakdown: [],
      trend: { direction: 'stable', changePercent: 0 },
      fanOpinions: {
        praiseCount: 0,
        criticismCount: 0,
        neutralCount: 0,
        topPraises: [],
        topCriticisms: [],
      },
      comparisonToTeammates: { ranking: 5, totalPlayers: 11 },
    };

    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisData = { ...analysisData, ...parsed };
      }
    } catch (parseError) {
      console.error('Failed to parse player analysis:', parseError);
    }

    const result: PlayerSentimentResponse = {
      playerName,
      club,
      overallRating: analysisData.overallRating || 5.0,
      sentimentLabel: analysisData.sentimentLabel || 'Neutral',
      topicBreakdown: analysisData.topicBreakdown || [],
      trend: analysisData.trend || { direction: 'stable', changePercent: 0 },
      fanOpinions: analysisData.fanOpinions || {
        praiseCount: 0,
        criticismCount: 0,
        neutralCount: 0,
        topPraises: [],
        topCriticisms: [],
      },
      comparisonToTeammates: analysisData.comparisonToTeammates || { ranking: 5, totalPlayers: 11 },
    };

    return new Response(
      JSON.stringify({
        ...result,
        postsAnalyzed: posts?.length || 0,
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash',
        provider: 'google',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-player-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
