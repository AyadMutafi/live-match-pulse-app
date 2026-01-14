import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface ClubAnalysisRequest {
  club: string;
  posts: Array<{ content: string; platform: string; author?: string; timestamp?: string }>;
  players?: string[];
}

interface ClubAnalysisResponse {
  club: string;
  overallSentiment: {
    score: number;
    label: string;
    trend: 'improving' | 'declining' | 'stable';
  };
  keyTalkingPoints: Array<{ topic: string; sentiment: string; mentionCount: number }>;
  sentimentTrend: {
    vsLastMatch: number;
    vsLastWeek: number;
  };
  playerSentiment: {
    topPraised: Array<{ name: string; score: number; topics: string[] }>;
    mostCriticized: Array<{ name: string; score: number; topics: string[] }>;
  };
  fanActivity: {
    totalMentions: number;
    platformBreakdown: Record<string, number>;
    peakActivity: string;
  };
  topEmotions: Array<{ emotion: string; percentage: number }>;
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

    const { club, posts, players }: ClubAnalysisRequest = await req.json();

    if (!club || !TARGET_CLUBS.some(c => c.toLowerCase().includes(club.toLowerCase()) || club.toLowerCase().includes(c.toLowerCase()))) {
      return new Response(
        JSON.stringify({ error: `Invalid club. Must be one of: ${TARGET_CLUBS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Posts array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${posts.length} posts for ${club}`);

    const platformCounts = posts.reduce((acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const systemPrompt = `You are an expert football/soccer fan sentiment analyst specializing in ${club}.

Analyze the provided social media posts and generate a comprehensive club sentiment report.

Return a JSON object with this exact structure:
{
  "overallSentiment": {
    "score": 72,
    "label": "Positive",
    "trend": "improving"
  },
  "keyTalkingPoints": [
    { "topic": "Transfer rumors", "sentiment": "excited", "mentionCount": 15 },
    { "topic": "Recent performance", "sentiment": "concerned", "mentionCount": 12 }
  ],
  "sentimentTrend": {
    "vsLastMatch": 5,
    "vsLastWeek": -3
  },
  "playerSentiment": {
    "topPraised": [
      { "name": "Player Name", "score": 85, "topics": ["goal scoring", "leadership"] }
    ],
    "mostCriticized": [
      { "name": "Player Name", "score": 35, "topics": ["defensive errors"] }
    ]
  },
  "topEmotions": [
    { "emotion": "Hope", "percentage": 35 },
    { "emotion": "Frustration", "percentage": 25 }
  ]
}

Analyze sentiment on a 0-100 scale. Detect specific player mentions and categorize their sentiment.
Consider sarcasm, irony, and football-specific context.`;

    const postsText = posts.slice(0, 50).map((p, idx) => 
      `[${idx}] [${p.platform}] ${p.content}`
    ).join('\n');

    const userPrompt = `Analyze these ${posts.length} social media posts about ${club}:
${players && players.length > 0 ? `\nKey players to track: ${players.join(', ')}` : ''}

Posts:
${postsText}`;

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
            maxOutputTokens: 3000,
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

    let analysisData: Partial<ClubAnalysisResponse> = {
      overallSentiment: { score: 50, label: 'Neutral', trend: 'stable' },
      keyTalkingPoints: [],
      sentimentTrend: { vsLastMatch: 0, vsLastWeek: 0 },
      playerSentiment: { topPraised: [], mostCriticized: [] },
      topEmotions: [],
    };

    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisData = { ...analysisData, ...parsed };
      }
    } catch (parseError) {
      console.error('Failed to parse analysis:', parseError);
    }

    const result: ClubAnalysisResponse = {
      club,
      overallSentiment: analysisData.overallSentiment!,
      keyTalkingPoints: analysisData.keyTalkingPoints || [],
      sentimentTrend: analysisData.sentimentTrend || { vsLastMatch: 0, vsLastWeek: 0 },
      playerSentiment: analysisData.playerSentiment || { topPraised: [], mostCriticized: [] },
      fanActivity: {
        totalMentions: posts.length,
        platformBreakdown: platformCounts,
        peakActivity: new Date().toISOString(),
      },
      topEmotions: analysisData.topEmotions || [],
    };

    return new Response(
      JSON.stringify({
        ...result,
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash',
        provider: 'google',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-club-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
