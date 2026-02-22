import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUBREDDITS = ['soccer', 'football', 'PremierLeague', 'LaLiga', 'SerieA', 'Bundesliga'];

async function getRedditAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'FanPulseApp/1.0',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reddit auth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function fetchSubreddit(subreddit: string, accessToken: string): Promise<any[]> {
  try {
    const res = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=15&raw_json=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'FanPulseApp/1.0',
      },
    });
    if (!res.ok) {
      console.warn(`Reddit r/${subreddit} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data?.data?.children || []).map((child: any) => child.data);
  } catch (e) {
    console.warn(`Failed to fetch r/${subreddit}:`, e);
    return [];
  }
}

function estimateSentiment(title: string): number {
  const positive = /🔥|amazing|incredible|brilliant|world class|goat|legend|🎉|great|love|best|fantastic|beautiful|stunning|🙌|💪|dominant|masterclass/i;
  const negative = /terrible|awful|worst|disgrace|embarrassing|pathetic|shambles|disaster|sack|😡|🤬|trash|finished|fraud|bottled|choking/i;
  const posMatches = (title.match(positive) || []).length;
  const negMatches = (title.match(negative) || []).length;
  if (posMatches > negMatches) return Math.min(90, 60 + posMatches * 10);
  if (negMatches > posMatches) return Math.max(10, 40 - negMatches * 10);
  return 50;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const clientId = Deno.env.get('REDDIT_CLIENT_ID');
    const clientSecret = Deno.env.get('REDDIT_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Authenticating with Reddit OAuth2...');
    const accessToken = await getRedditAccessToken(clientId, clientSecret);
    console.log('Reddit OAuth2 token obtained, fetching posts...');

    // Fetch from all subreddits in parallel
    const results = await Promise.all(SUBREDDITS.map(s => fetchSubreddit(s, accessToken)));
    const allPosts = results.flat();

    if (allPosts.length === 0) {
      return new Response(JSON.stringify({ message: 'No Reddit posts fetched' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetched ${allPosts.length} Reddit posts total`);

    // Filter to football-relevant and non-stickied posts
    const relevantPosts = allPosts.filter(p =>
      !p.stickied && p.title && p.title.length > 10 && p.score > 5
    );

    // Check existing post_ids to avoid duplicates
    const redditIds = relevantPosts.map(p => `reddit-${p.id}`);
    const { data: existing } = await supabase
      .from('social_posts')
      .select('post_id')
      .in('post_id', redditIds);
    const existingIds = new Set((existing || []).map(e => e.post_id));

    const newPosts = relevantPosts
      .filter(p => !existingIds.has(`reddit-${p.id}`))
      .slice(0, 30);

    if (newPosts.length === 0) {
      return new Response(JSON.stringify({ message: 'No new Reddit posts to insert' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dbPosts = newPosts.map(p => {
      const rawScore = estimateSentiment(p.title);
      const scaledScore = parseFloat((Math.min(9.99, Math.max(0, (rawScore / 100) * 9.99))).toFixed(2));
      return {
        post_id: `reddit-${p.id}`,
        author_handle: `u/${p.author}`,
        content: p.title.slice(0, 500),
        platform: 'facebook' as const, // Enum limitation — Reddit mapped to facebook
        sentiment_score: scaledScore,
        posted_at: new Date(p.created_utc * 1000).toISOString(),
        processed_at: new Date().toISOString(),
        engagement_metrics: {
          likes: p.score || 0,
          shares: p.num_crossposts || 0,
          views: p.score * 10,
          comments: p.num_comments || 0,
        },
        emotions: {
          source: 'reddit',
          subreddit: p.subreddit,
          permalink: `https://reddit.com${p.permalink}`,
        },
      };
    });

    const { error: insertErr } = await supabase.from('social_posts').insert(dbPosts);
    if (insertErr) {
      console.error('Insert error:', insertErr);
      throw insertErr;
    }

    console.log(`Inserted ${dbPosts.length} Reddit posts`);

    return new Response(JSON.stringify({
      success: true,
      postsInserted: dbPosts.length,
      subredditsScanned: SUBREDDITS.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch Reddit posts' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
