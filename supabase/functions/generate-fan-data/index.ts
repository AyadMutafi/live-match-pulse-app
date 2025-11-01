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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch matches from Sept 15 to Oct 2, 2025
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name, league, country),
        away_team:teams!matches_away_team_id_fkey(id, name, league, country)
      `)
      .gte('match_date', '2025-09-15')
      .lte('match_date', '2025-10-02')
      .order('match_date', { ascending: true });

    if (matchError) throw matchError;

    console.log(`Found ${matches?.length || 0} matches to generate fan data for`);

    let totalPosts = 0;
    let totalReactions = 0;

    // Generate social posts and fan reactions for each match
    for (const match of matches || []) {
      // Skip if match doesn't have scores (not finished)
      if (match.status !== 'finished' || match.home_score === null) continue;

      const homeTeam = match.home_team;
      const awayTeam = match.away_team;
      const homeScore = match.home_score;
      const awayScore = match.away_score;

      // Determine winner and sentiment
      const homeWin = homeScore > awayScore;
      const draw = homeScore === awayScore;
      const awayWin = awayScore > homeScore;

      const postTemplates = [
        `What a match! ${homeTeam.name} ${homeScore}-${awayScore} ${awayTeam.name}! 🔥⚽`,
        `Incredible performance from ${homeWin ? homeTeam.name : awayTeam.name}! This is why we love football! ⚽💪`,
        `${homeScore}-${awayScore}! ${draw ? 'Fair result' : homeWin ? homeTeam.name + ' dominated' : awayTeam.name + ' on fire'}! 🎯`,
        `Can't believe what I just watched! ${homeTeam.name} vs ${awayTeam.name} was EPIC! 🤯`,
        `${homeWin ? homeTeam.name : awayTeam.name} showing why they're the best! What a game! 🔥`,
      ];

      // Generate 15-25 social posts per match
      const numPosts = Math.floor(Math.random() * 11) + 15;
      const socialPosts = [];

      for (let i = 0; i < numPosts; i++) {
        const sentiment = draw ? 0.5 : (Math.random() * 0.4) + (homeWin ? 0.4 : 0.1);
        const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
        
        socialPosts.push({
          platform: ['twitter', 'instagram', 'facebook'][Math.floor(Math.random() * 3)],
          match_id: match.id,
          team_id: Math.random() > 0.5 ? homeTeam.id : awayTeam.id,
          post_id: `post_${match.id}_${i}`,
          author_handle: `fan${Math.floor(Math.random() * 10000)}`,
          content: template,
          sentiment_score: sentiment,
          emotions: {
            joy: sentiment > 0.6 ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
            excitement: Math.random() * 0.7 + 0.3,
            frustration: sentiment < 0.4 ? Math.random() * 0.6 : Math.random() * 0.2,
          },
          engagement_metrics: {
            likes: Math.floor(Math.random() * 5000) + 500,
            retweets: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 500) + 50,
          },
          posted_at: new Date(match.match_date).toISOString(),
          processed_at: new Date().toISOString(),
        });
      }

      // Insert social posts
      const { error: postsError } = await supabase
        .from('social_posts')
        .upsert(socialPosts, { onConflict: 'post_id' });

      if (postsError) {
        console.error('Error inserting social posts:', postsError);
      } else {
        totalPosts += socialPosts.length;
      }
    }

    console.log(`Generated ${totalPosts} social posts and ${totalReactions} fan reactions`);

    return new Response(
      JSON.stringify({
        success: true,
        matchesProcessed: matches?.length || 0,
        postsGenerated: totalPosts,
        reactionsGenerated: totalReactions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating fan data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});