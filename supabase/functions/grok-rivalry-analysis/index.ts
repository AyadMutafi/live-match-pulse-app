const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs and their rivalries
const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

const CLASSIC_RIVALRIES = [
  ['FC Barcelona', 'Real Madrid CF', 'El Clásico'],
  ['Liverpool FC', 'Manchester United FC', 'North West Derby'],
  ['Manchester City FC', 'Manchester United FC', 'Manchester Derby'],
  ['Arsenal FC', 'Manchester United FC', 'Historic Rivalry'],
  ['Atletico de Madrid', 'Real Madrid CF', 'Madrid Derby'],
  ['Liverpool FC', 'Manchester City FC', 'Title Race Rivalry'],
];

interface RivalryAnalysisResponse {
  rivalry: {
    clubA: string;
    clubB: string;
    name: string;
  };
  sentimentComparison: {
    clubA: { score: number; label: string; emoji: string };
    clubB: { score: number; label: string; emoji: string };
    advantage: string;
  };
  activityComparison: {
    clubA: { mentions: number; engagement: number };
    clubB: { mentions: number; engagement: number };
    louderFanbase: string;
  };
  fanNarratives: {
    clubA: string[];
    clubB: string[];
  };
  rivalryInsights: {
    intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
    mainTopics: string[];
    controversies: string[];
    banterHighlights: string[];
  };
  headToHead: {
    recentTone: 'friendly' | 'tense' | 'hostile';
    trendingHashtags: string[];
  };
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

    const { clubA, clubB, postsClubA, postsClubB } = await req.json();

    if (!clubA || !clubB || !TARGET_CLUBS.includes(clubA) || !TARGET_CLUBS.includes(clubB)) {
      return new Response(
        JSON.stringify({ 
          error: 'Both clubs must be valid target clubs',
          availableClubs: TARGET_CLUBS,
          classicRivalries: CLASSIC_RIVALRIES.map(r => ({ clubA: r[0], clubB: r[1], name: r[2] }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find rivalry name
    const rivalryMatch = CLASSIC_RIVALRIES.find(
      r => (r[0] === clubA && r[1] === clubB) || (r[0] === clubB && r[1] === clubA)
    );
    const rivalryName = rivalryMatch ? rivalryMatch[2] as string : `${clubA} vs ${clubB}`;

    console.log(`Analyzing rivalry: ${rivalryName}`);

    const systemPrompt = `You are an expert football rivalry analyst specializing in fan sentiment comparison between ${clubA} and ${clubB} (${rivalryName}).

Analyze social media posts from both fanbases and provide a comprehensive rivalry analysis.

Consider:
1. Overall sentiment comparison (who's happier/more confident?)
2. Activity levels and engagement (who's louder on social media?)
3. What each fanbase is saying about their team AND the rival
4. Banter, trash talk, and rivalry-specific themes
5. Any controversies or heated debates between fans

Return JSON with this exact structure:
{
  "sentimentComparison": {
    "clubA": { "score": 0-100, "label": "sentiment label", "emoji": "emoji" },
    "clubB": { "score": 0-100, "label": "sentiment label", "emoji": "emoji" },
    "advantage": "clubA or clubB or neutral"
  },
  "activityComparison": {
    "clubA": { "mentions": count, "engagement": score },
    "clubB": { "mentions": count, "engagement": score },
    "louderFanbase": "clubA or clubB"
  },
  "fanNarratives": {
    "clubA": ["what clubA fans are saying (3-5 points)"],
    "clubB": ["what clubB fans are saying (3-5 points)"]
  },
  "rivalryInsights": {
    "intensity": "Low/Moderate/High/Extreme",
    "mainTopics": ["topic1", "topic2"],
    "controversies": ["controversy1"],
    "banterHighlights": ["banter example 1", "banter example 2"]
  },
  "headToHead": {
    "recentTone": "friendly/tense/hostile",
    "trendingHashtags": ["#hashtag1", "#hashtag2"]
  }
}`;

    const postsA = postsClubA || [];
    const postsB = postsClubB || [];

    const userPrompt = `Analyze this rivalry between ${clubA} and ${clubB} (${rivalryName}):

=== ${clubA} FANS (${postsA.length} posts) ===
${postsA.slice(0, 40).map((p: any, i: number) => `[${i + 1}] ${p.content}`).join('\n')}

=== ${clubB} FANS (${postsB.length} posts) ===
${postsB.slice(0, 40).map((p: any, i: number) => `[${i + 1}] ${p.content}`).join('\n')}

Provide comprehensive rivalry comparison analysis.`;

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
        temperature: 0.5,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', grokResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze rivalry with Grok' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const grokData = await grokResponse.json();
    const responseText = grokData.choices[0].message.content;

    // Parse the JSON response
    let analysis: RivalryAnalysisResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = {
          rivalry: { clubA, clubB, name: rivalryName },
          sentimentComparison: parsed.sentimentComparison || {
            clubA: { score: 50, label: 'Neutral', emoji: '😐' },
            clubB: { score: 50, label: 'Neutral', emoji: '😐' },
            advantage: 'neutral',
          },
          activityComparison: {
            clubA: { mentions: postsA.length, engagement: parsed.activityComparison?.clubA?.engagement || 0 },
            clubB: { mentions: postsB.length, engagement: parsed.activityComparison?.clubB?.engagement || 0 },
            louderFanbase: parsed.activityComparison?.louderFanbase || (postsA.length > postsB.length ? 'clubA' : 'clubB'),
          },
          fanNarratives: parsed.fanNarratives || { clubA: [], clubB: [] },
          rivalryInsights: parsed.rivalryInsights || {
            intensity: 'Moderate',
            mainTopics: [],
            controversies: [],
            banterHighlights: [],
          },
          headToHead: parsed.headToHead || {
            recentTone: 'tense',
            trendingHashtags: [],
          },
          analysisDate: new Date().toISOString(),
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', parseError);
      analysis = {
        rivalry: { clubA, clubB, name: rivalryName },
        sentimentComparison: {
          clubA: { score: 50, label: 'Neutral', emoji: '😐' },
          clubB: { score: 50, label: 'Neutral', emoji: '😐' },
          advantage: 'neutral',
        },
        activityComparison: {
          clubA: { mentions: postsA.length, engagement: 0 },
          clubB: { mentions: postsB.length, engagement: 0 },
          louderFanbase: postsA.length > postsB.length ? 'clubA' : 'clubB',
        },
        fanNarratives: { clubA: [], clubB: [] },
        rivalryInsights: {
          intensity: 'Moderate',
          mainTopics: [],
          controversies: [],
          banterHighlights: [],
        },
        headToHead: {
          recentTone: 'tense',
          trendingHashtags: [],
        },
        analysisDate: new Date().toISOString(),
      };
    }

    console.log('Rivalry analysis complete:', rivalryName);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grok-rivalry-analysis:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
