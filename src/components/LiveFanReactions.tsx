import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Repeat2, Eye, ExternalLink, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to generate a link to the original post
function getPostUrl(platform: string, postId: string, authorHandle: string | null): string | null {
  if (!postId) return null;
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      // Twitter/X format: https://twitter.com/{handle}/status/{postId}
      if (authorHandle) {
        return `https://twitter.com/${authorHandle}/status/${postId}`;
      }
      return `https://twitter.com/i/status/${postId}`;
    case 'instagram':
      // Instagram format: https://instagram.com/p/{postId}
      return `https://instagram.com/p/${postId}`;
    case 'facebook':
      // Facebook format varies, but this is a common pattern
      return `https://facebook.com/${postId}`;
    default:
      return null;
  }
}
// Filter for inappropriate content
const INAPPROPRIATE_WORDS = [
  'fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard', 'hell', 'dick', 'pussy', 'cock',
  'sex', 'porn', 'nude', 'rape', 'abuse', 'kill', 'die', 'stupid', 'idiot', 'hate'
];

function containsInappropriateContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return INAPPROPRIATE_WORDS.some(word => lowerText.includes(word));
}

function getSentimentColor(score: number | null): string {
  if (!score) return 'bg-muted';
  if (score >= 0.6) return 'bg-green-500/20 text-green-700 dark:text-green-400';
  if (score >= 0.4) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
  return 'bg-red-500/20 text-red-700 dark:text-red-400';
}

function getSentimentLabel(score: number | null): string {
  if (!score) return 'Neutral';
  if (score >= 0.6) return 'Positive';
  if (score >= 0.4) return 'Neutral';
  return 'Negative';
}

export function LiveFanReactions() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['live-fan-reactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Filter out inappropriate content and sort by engagement
      const filteredPosts = (data || [])
        .filter(post => !containsInappropriateContent(post.content))
        .map(post => {
          const metrics = post.engagement_metrics as any || {};
          const totalEngagement = 
            (metrics.likes || 0) + 
            (metrics.retweets || 0) + 
            (metrics.replies || 0) + 
            (metrics.views || 0);
          return { ...post, totalEngagement };
        })
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5);

      return filteredPosts;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Fan Reactions Yet</h3>
          <p className="text-sm text-muted-foreground">
            Check back soon for live fan reactions from social media
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <MessageCircle className="h-5 w-5" />
            Live Fan Reactions
          </h3>
          <p className="text-sm text-muted-foreground">
            Most engaging recent posts from fans across social platforms
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => {
            const metrics = post.engagement_metrics as any || {};
            const sentiment = post.sentiment_score as number | null;
            
            const postUrl = getPostUrl(post.platform, post.post_id, post.author_handle);
            
            const cardContent = (
              <>
                {/* Author Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {post.author_handle ? `@${post.author_handle}` : 'Anonymous Fan'}
                      </span>
                      {postUrl && (
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs capitalize">
                        {post.platform}
                      </Badge>
                      <span>•</span>
                      <span>
                        {new Date(post.posted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={getSentimentColor(sentiment)}>
                    {getSentimentLabel(sentiment)}
                  </Badge>
                </div>

                {/* Content */}
                <p className="text-sm text-foreground leading-relaxed">
                  {post.content}
                </p>

                {/* Engagement Metrics */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                  {metrics.likes > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{metrics.likes.toLocaleString()}</span>
                    </div>
                  )}
                  {metrics.retweets > 0 && (
                    <div className="flex items-center gap-1">
                      <Repeat2 className="h-3.5 w-3.5" />
                      <span>{metrics.retweets.toLocaleString()}</span>
                    </div>
                  )}
                  {metrics.replies > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{metrics.replies.toLocaleString()}</span>
                    </div>
                  )}
                  {metrics.views > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{metrics.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </>
            );

            return postUrl ? (
              <a
                key={post.id}
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg p-4 hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
              >
                {cardContent}
              </a>
            ) : (
              <div
                key={post.id}
                className="border border-border rounded-lg p-4"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
