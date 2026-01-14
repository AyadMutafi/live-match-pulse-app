import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target clubs for analysis
const TARGET_CLUBS = [
  'FC Barcelona', 'Real Madrid CF', 'Atletico de Madrid',
  'Liverpool FC', 'Manchester City FC', 'Manchester United FC', 'Arsenal FC'
];

// Sentiment categories
const SENTIMENT_CATEGORIES = [
  'Euphoric', 'Optimistic', 'Pleased', 'Neutral', 'Concerned',
  'Nervous', 'Frustrated', 'Angry', 'Outraged', 'Devastated'
];

interface SentimentResult {
  postId: string;
  originalContent: string;
  sentiment: {
    category: string;
    score: number;
    intensity: 'Weak' | 'Moderate' | 'Strong' | 'Extreme';
    sarcasmDetected: boolean;
    topics: string[];
    emotionKeywords: string[];
  };
  clubMentioned: string | null;
  language: string;
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

    const { posts, clubFilter } = await req.json();

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Posts array is required and must not be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing sentiment for ${posts.length} posts${clubFilter ? ` (filtered: ${clubFilter})` : ''}`);

    const systemPrompt = `You are an expert football/soccer sentiment analyst specializing in fan emotions for these clubs: ${TARGET_CLUBS.join(', ')}.

Analyze each social media post and return a JSON array with sentiment analysis for each post.

SENTIMENT CATEGORIES (from most positive to most negative):
1. Euphoric (90-100): Extreme joy, celebration
2. Optimistic (75-89): Hopeful, positive outlook
3. Pleased (60-74): Satisfied, content
4. Neutral (45-59): No strong emotion
5. Concerned (35-44): Slight worry
6. Nervous (25-34): Anxiety, tension
7. Frustrated (15-24): Disappointment, annoyance
8. Angry (8-14): Strong displeasure
9. Outraged (3-7): Intense anger
10. Devastated (0-2): Extreme sadness

For each post, detect:
- Sarcasm and irony (common in football discourse)
- Football-specific context (transfers, tactics, injuries, refs)
- Multi-language support (English, Spanish)
- Specific topics discussed
- Emotion keywords used

Return ONLY a valid JSON array with this structure for each post:
{
  "index": 0,
  "category": "Euphoric",
  "score": 92,
  "intensity": "Strong",
  "sarcasmDetected": false,
  "topics": ["goal", "victory"],
  "emotionKeywords": ["amazing", "brilliant"],
  "clubMentioned": "FC Barcelona",
  "language": "en"
}`;

    const postsText = posts.map((post: any, idx: number) => 
      `[${idx}] ${post.content || post.text || post}`
    ).join('\n\n');

    const userPrompt = `Analyze these ${posts.length} social media posts about football clubs:\n\n${postsText}`;

    // Use Gemini API
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
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 4096,
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
    console.log('Gemini response received');

    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    let analysisResults: any[] = [];
    try {
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Return default analysis
      analysisResults = posts.map((_: any, idx: number) => ({
        index: idx,
        category: 'Neutral',
        score: 50,
        intensity: 'Moderate',
        sarcasmDetected: false,
        topics: ['general'],
        emotionKeywords: [],
        clubMentioned: null,
        language: 'en'
      }));
    }

    // Map results back to posts
    const results: SentimentResult[] = posts.map((post: any, idx: number) => {
      const analysis = analysisResults.find((a: any) => a.index === idx) || analysisResults[idx] || {
        category: 'Neutral',
        score: 50,
        intensity: 'Moderate',
        sarcasmDetected: false,
        topics: ['general'],
        emotionKeywords: [],
        clubMentioned: null,
        language: 'en'
      };

      return {
        postId: post.id || `post-${idx}`,
        originalContent: post.content || post.text || post,
        sentiment: {
          category: analysis.category || 'Neutral',
          score: analysis.score || 50,
          intensity: analysis.intensity || 'Moderate',
          sarcasmDetected: analysis.sarcasmDetected || false,
          topics: analysis.topics || [],
          emotionKeywords: analysis.emotionKeywords || [],
        },
        clubMentioned: analysis.clubMentioned || null,
        language: analysis.language || 'en',
      };
    });

    // Calculate aggregate statistics
    const avgScore = results.reduce((sum, r) => sum + r.sentiment.score, 0) / results.length;
    const categoryBreakdown = results.reduce((acc, r) => {
      acc[r.sentiment.category] = (acc[r.sentiment.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTopics = getTopTopics(results);

    return new Response(
      JSON.stringify({
        results,
        aggregateStats: {
          totalPosts: results.length,
          averageScore: Math.round(avgScore * 10) / 10,
          categoryBreakdown,
          topTopics,
          dominantCategory: getDominantCategory(results),
          sarcasmCount: results.filter(r => r.sentiment.sarcasmDetected).length,
        },
        model: 'gemini-2.0-flash',
        provider: 'google',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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

function getDominantCategory(results: SentimentResult[]): string {
  const categoryCounts: Record<string, number> = {};
  results.forEach(r => {
    categoryCounts[r.sentiment.category] = (categoryCounts[r.sentiment.category] || 0) + 1;
  });
  return Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';
}
