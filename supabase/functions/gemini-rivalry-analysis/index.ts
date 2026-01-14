import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface RivalryAnalysisRequest {
  clubA: string;
  clubB: string;
  postsClubA: Array<{ content: string; platform: string }>;
  postsClubB: Array<{ content: string; platform: string }>;
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

    const { clubA, clubB, postsClubA, postsClubB }: RivalryAnalysisRequest = await req.json();

    if (!clubA || !clubB) {
      return new Response(
        JSON.stringify({ error: 'Both clubA and clubB are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing rivalry between ${clubA} and ${clubB}`);

    const systemPrompt = `You are an expert football/soccer rivalry analyst. Analyze fan sentiment and dynamics between two rival clubs.

Target clubs: ${TARGET_CLUBS.join(', ')}

Analyze the posts from both fan bases and return a JSON object:
{
  "sentimentComparison": {
    "clubA": { "score": 72, "dominantEmotion": "Confident" },
    "clubB": { "score": 65, "dominantEmotion": "Nervous" }
  },
  "fanActivity": {
    "clubA": { "mentions": 150, "engagement": "high" },
    "clubB": { "mentions": 120, "engagement": "moderate" }
  },
  "whatFansAreSaying": {
    "clubA": ["Key narrative 1", "Key narrative 2"],
    "clubB": ["Key narrative 1", "Key narrative 2"]
  },
  "rivalryInsights": {
    "tensionLevel": "high",
    "keyDebates": ["Topic 1", "Topic 2"],
    "prediction": "Brief fan prediction summary",
    "historicalContext": "Brief rivalry context"
  },
  "headToHeadSentiment": {
    "moreConfident": "clubA or clubB",
    "moreAnxious": "clubA or clubB",
    "moreOptimistic": "clubA or clubB"
  }
}`;

    const clubAPostsText = (postsClubA || []).slice(0, 25).map((p, idx) => 
      `[A${idx}] ${p.content}`
    ).join('\n');

    const clubBPostsText = (postsClubB || []).slice(0, 25).map((p, idx) => 
      `[B${idx}] ${p.content}`
    ).join('\n');

    const userPrompt = `Analyze this football rivalry:

Club A: ${clubA}
Posts from ${clubA} fans:
${clubAPostsText || 'No posts available'}

Club B: ${clubB}
Posts from ${clubB} fans:
${clubBPostsText || 'No posts available'}`;

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
            temperature: 0.5,
            topP: 0.9,
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

    let analysisData: any = {
      sentimentComparison: {
        clubA: { score: 50, dominantEmotion: 'Neutral' },
        clubB: { score: 50, dominantEmotion: 'Neutral' },
      },
      fanActivity: {
        clubA: { mentions: postsClubA?.length || 0, engagement: 'moderate' },
        clubB: { mentions: postsClubB?.length || 0, engagement: 'moderate' },
      },
      whatFansAreSaying: { clubA: [], clubB: [] },
      rivalryInsights: {
        tensionLevel: 'moderate',
        keyDebates: [],
        prediction: '',
        historicalContext: '',
      },
      headToHeadSentiment: {
        moreConfident: clubA,
        moreAnxious: clubB,
        moreOptimistic: clubA,
      },
    };

    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisData = { ...analysisData, ...parsed };
      }
    } catch (parseError) {
      console.error('Failed to parse rivalry analysis:', parseError);
    }

    return new Response(
      JSON.stringify({
        clubA,
        clubB,
        ...analysisData,
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash',
        provider: 'google',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-rivalry-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
