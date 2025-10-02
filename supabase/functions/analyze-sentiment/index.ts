import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { matchId } = await req.json();

    // Fetch social posts for the match
    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select('content, sentiment_score, emotions')
      .eq('match_id', matchId)
      .limit(50);

    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No social posts found for this match' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to analyze sentiment
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert specializing in sports fan reactions. Analyze the overall sentiment and key emotions from fan posts.',
          },
          {
            role: 'user',
            content: `Analyze these fan reactions and provide a summary:\n${posts.map(p => p.content).join('\n')}\n\nProvide: 1) Overall sentiment (positive/neutral/negative), 2) Dominant emotions, 3) Key themes`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Calculate aggregate sentiment
    const avgSentiment = posts.reduce((sum, p) => sum + (p.sentiment_score || 0), 0) / posts.length;
    
    return new Response(
      JSON.stringify({
        matchId,
        totalPosts: posts.length,
        averageSentiment: avgSentiment,
        aiAnalysis: analysis,
        posts: posts.slice(0, 10), // Return top 10 posts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});