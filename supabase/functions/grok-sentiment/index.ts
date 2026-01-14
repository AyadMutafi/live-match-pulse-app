import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs for analysis
const TARGET_CLUBS = {
  spain: ['FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid'],
  england: ['Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'],
};

const ALL_TARGET_CLUBS = [...TARGET_CLUBS.spain, ...TARGET_CLUBS.england];

// Sentiment categories from Euphoric to Devastated
const SENTIMENT_CATEGORIES = [
  'Euphoric', 'Optimistic', 'Pleased', 'Neutral', 'Concerned',
  'Nervous', 'Frustrated', 'Angry', 'Outraged', 'Devastated'
];

interface SentimentResult {
  postId: string;
  content: string;
  sentiment: {
    category: string;
    score: number;
    intensity: 'Weak' | 'Moderate' | 'Strong' | 'Extreme';
    sarcasmDetected: boolean;
    topics: string[];
    emotionKeywords: string[];
    language: 'en' | 'es';
    club: string;
  };
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

    const { posts, clubFilter } = await req.json();

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Posts array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter posts to only target clubs if specified
    const filteredPosts = clubFilter 
      ? posts.filter((p: any) => p.club === clubFilter || ALL_TARGET_CLUBS.includes(p.club))
      : posts;

    console.log(`Analyzing ${filteredPosts.length} posts for sentiment`);

    const systemPrompt = `You are an expert football/soccer sentiment analyst specializing in fan reactions for these clubs: ${ALL_TARGET_CLUBS.join(', ')}.

Analyze social media posts and provide nuanced sentiment analysis with these 10 categories:
- Euphoric (score 90-100): Pure joy, celebration, peak excitement
- Optimistic (score 75-89): Hopeful, confident, positive outlook
- Pleased (score 60-74): Satisfied, content, mildly positive
- Neutral (score 45-59): No strong emotion, factual, balanced
- Concerned (score 35-44): Slight worry, cautious, uncertain
- Nervous (score 25-34): Anxious, worried, uneasy
- Frustrated (score 15-24): Annoyed, disappointed, impatient
- Angry (score 8-14): Mad, upset, demanding change
- Outraged (score 3-7): Furious, hostile, extreme anger
- Devastated (score 0-2): Crushed, heartbroken, despair

Important:
1. Detect sarcasm and irony (common in football banter)
2. Understand football-specific context (terms like "siuuu", "YNWA", "Visca Barça")
3. Support English and Spanish posts
4. Identify specific topics (transfers, manager, tactics, player performance, rival banter)
5. Extract emotion keywords from the text

Return JSON array matching the input posts order.`;

    const userPrompt = `Analyze these ${filteredPosts.length} social media posts about football clubs:

${filteredPosts.map((p: any, i: number) => `[${i}] Club: ${p.club || 'Unknown'}\nContent: "${p.content}"`).join('\n\n')}

Return a JSON array with analysis for each post:
[
  {
    "index": 0,
    "category": "Euphoric",
    "score": 95,
    "intensity": "Extreme",
    "sarcasmDetected": false,
    "topics": ["goal celebration", "player performance"],
    "emotionKeywords": ["amazing", "world class"],
    "language": "en"
  }
]`;

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
        temperature: 0.3,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', grokResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze sentiment with Grok' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const grokData = await grokResponse.json();
    const analysisText = grokData.choices[0].message.content;

    // Parse the JSON from Grok's response
    let analyses: any[];
    try {
      const jsonMatch = analysisText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        analyses = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', parseError);
      // Fallback: generate basic analysis
      analyses = filteredPosts.map((_: any, i: number) => ({
        index: i,
        category: 'Neutral',
        score: 50,
        intensity: 'Moderate',
        sarcasmDetected: false,
        topics: ['general'],
        emotionKeywords: [],
        language: 'en'
      }));
    }

    // Map analyses back to posts
    const results: SentimentResult[] = filteredPosts.map((post: any, index: number) => {
      const analysis = analyses.find((a: any) => a.index === index) || analyses[index] || {
        category: 'Neutral',
        score: 50,
        intensity: 'Moderate',
        sarcasmDetected: false,
        topics: [],
        emotionKeywords: [],
        language: 'en'
      };

      return {
        postId: post.id || `post-${index}`,
        content: post.content,
        sentiment: {
          category: analysis.category || 'Neutral',
          score: analysis.score || 50,
          intensity: analysis.intensity || 'Moderate',
          sarcasmDetected: analysis.sarcasmDetected || false,
          topics: analysis.topics || [],
          emotionKeywords: analysis.emotionKeywords || [],
          language: analysis.language || 'en',
          club: post.club || 'Unknown',
        },
      };
    });

    // Calculate aggregate stats
    const aggregateStats = {
      totalPosts: results.length,
      averageScore: Math.round(results.reduce((sum, r) => sum + r.sentiment.score, 0) / results.length),
      categoryBreakdown: SENTIMENT_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = results.filter(r => r.sentiment.category === cat).length;
        return acc;
      }, {} as Record<string, number>),
      sarcasmCount: results.filter(r => r.sentiment.sarcasmDetected).length,
      topTopics: getTopTopics(results),
      byClub: ALL_TARGET_CLUBS.reduce((acc, club) => {
        const clubPosts = results.filter(r => r.sentiment.club === club);
        if (clubPosts.length > 0) {
          acc[club] = {
            count: clubPosts.length,
            averageScore: Math.round(clubPosts.reduce((sum, r) => sum + r.sentiment.score, 0) / clubPosts.length),
            dominantCategory: getDominantCategory(clubPosts),
          };
        }
        return acc;
      }, {} as Record<string, any>),
    };

    console.log('Sentiment analysis complete:', aggregateStats);

    return new Response(
      JSON.stringify({
        results,
        aggregateStats,
        targetClubs: ALL_TARGET_CLUBS,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grok-sentiment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getTopTopics(results: SentimentResult[]): string[] {
  const topicCounts: Record<string, number> = {};
  results.forEach(r => {
    r.sentiment.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
}

function getDominantCategory(posts: SentimentResult[]): string {
  const categoryCounts: Record<string, number> = {};
  posts.forEach(p => {
    categoryCounts[p.sentiment.category] = (categoryCounts[p.sentiment.category] || 0) + 1;
  });
  return Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';
}
