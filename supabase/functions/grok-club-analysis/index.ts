import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs for analysis
const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

interface ClubAnalysisResponse {
  club: string;
  analysisDate: string;
  overallSentiment: {
    score: number;
    label: string;
    emoji: string;
  };
  keyTalkingPoints: Array<{
    topic: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    mentionCount: number;
    summary: string;
  }>;
  sentimentTrend: {
    vsLastMatch: { direction: 'up' | 'down' | 'stable'; change: number };
    vsLastWeek: { direction: 'up' | 'down' | 'stable'; change: number };
  };
  playerSentiment: {
    praised: Array<{ name: string; score: number; topics: string[] }>;
    criticized: Array<{ name: string; score: number; topics: string[] }>;
  };
  fanActivity: {
    totalMentions: number;
    peakHour: string;
    platforms: Record<string, number>;
  };
  topEmotions: string[];
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

    const { club, posts, players } = await req.json();

    if (!club || !TARGET_CLUBS.includes(club)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid club. Must be one of: ' + TARGET_CLUBS.join(', '),
          availableClubs: TARGET_CLUBS 
        }),
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

    const systemPrompt = `You are an expert football analyst specializing in fan sentiment analysis for ${club}.

Analyze the provided social media posts and return a comprehensive club sentiment report.

Consider:
1. Overall fan mood and sentiment (0-100 score)
2. Top 5 talking points fans are discussing
3. Player-specific sentiment (who's praised, who's criticized)
4. Emotional patterns and intensity
5. Trends compared to typical fan behavior

For player analysis, look for mentions of these players: ${players?.join(', ') || 'any mentioned players'}

Return JSON with this exact structure:
{
  "overallSentiment": {
    "score": 0-100,
    "label": "Euphoric/Optimistic/Pleased/Neutral/Concerned/Frustrated/Angry/Devastated",
    "emoji": "appropriate emoji"
  },
  "keyTalkingPoints": [
    {
      "topic": "topic name",
      "sentiment": "positive/negative/neutral",
      "mentionCount": estimated count,
      "summary": "brief summary"
    }
  ],
  "sentimentTrend": {
    "vsLastMatch": { "direction": "up/down/stable", "change": percentage },
    "vsLastWeek": { "direction": "up/down/stable", "change": percentage }
  },
  "playerSentiment": {
    "praised": [{ "name": "player", "score": 0-100, "topics": ["what fans praise"] }],
    "criticized": [{ "name": "player", "score": 0-100, "topics": ["what fans criticize"] }]
  },
  "topEmotions": ["emotion1", "emotion2", "emotion3"]
}`;

    const userPrompt = `Analyze these ${posts.length} social media posts about ${club}:

${posts.slice(0, 100).map((p: any, i: number) => `[${i + 1}] ${p.content}`).join('\n')}

Provide comprehensive club sentiment analysis.`;

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
        JSON.stringify({ error: 'Failed to analyze club sentiment with Grok' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const grokData = await grokResponse.json();
    const responseText = grokData.choices[0].message.content;

    // Parse the JSON response
    let analysis: ClubAnalysisResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = {
          club,
          analysisDate: new Date().toISOString(),
          overallSentiment: parsed.overallSentiment || { score: 50, label: 'Neutral', emoji: '😐' },
          keyTalkingPoints: (parsed.keyTalkingPoints || []).slice(0, 5),
          sentimentTrend: parsed.sentimentTrend || {
            vsLastMatch: { direction: 'stable', change: 0 },
            vsLastWeek: { direction: 'stable', change: 0 },
          },
          playerSentiment: {
            praised: (parsed.playerSentiment?.praised || []).slice(0, 5),
            criticized: (parsed.playerSentiment?.criticized || []).slice(0, 3),
          },
          fanActivity: {
            totalMentions: posts.length,
            peakHour: new Date().getHours() + ':00',
            platforms: countPlatforms(posts),
          },
          topEmotions: parsed.topEmotions || ['mixed', 'passionate', 'engaged'],
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', parseError);
      analysis = {
        club,
        analysisDate: new Date().toISOString(),
        overallSentiment: { score: 50, label: 'Neutral', emoji: '😐' },
        keyTalkingPoints: [],
        sentimentTrend: {
          vsLastMatch: { direction: 'stable', change: 0 },
          vsLastWeek: { direction: 'stable', change: 0 },
        },
        playerSentiment: { praised: [], criticized: [] },
        fanActivity: {
          totalMentions: posts.length,
          peakHour: new Date().getHours() + ':00',
          platforms: countPlatforms(posts),
        },
        topEmotions: ['engaged'],
      };
    }

    console.log('Club analysis complete:', club, analysis.overallSentiment.score);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grok-club-analysis:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function countPlatforms(posts: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  posts.forEach(p => {
    const platform = p.platform || 'unknown';
    counts[platform] = (counts[platform] || 0) + 1;
  });
  return counts;
}
