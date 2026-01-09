import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformBadge } from "./PlatformBadge";
import { SentimentIntensityBadge } from "./SentimentIntensityBadge";
import { Radio, Heart, Repeat2, Eye, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveMatches } from "@/hooks/useMatches";

interface SocialPost {
  id: string;
  author: string;
  content: string;
  platform: "twitter" | "reddit" | "instagram";
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  likes: number;
  shares: number;
  views: number;
  timestamp: string;
  isNew?: boolean;
}

// Sample posts that simulate real social media monitoring
const generateSamplePosts = (): SocialPost[] => [
  {
    id: "1",
    author: "@FootballFanatic",
    content: "Absolutely incredible performance from Haaland tonight! 🔥 The way he moves in the box is just world class. #MCITOT",
    platform: "twitter",
    sentiment: "positive",
    sentimentScore: 92,
    likes: 2340,
    shares: 456,
    views: 45000,
    timestamp: "2m ago"
  },
  {
    id: "2",
    author: "r/soccer user",
    content: "The atmosphere at the Etihad is electric right now. City fans really showing up for this one.",
    platform: "reddit",
    sentiment: "positive",
    sentimentScore: 78,
    likes: 892,
    shares: 124,
    views: 12000,
    timestamp: "3m ago"
  },
  {
    id: "3",
    author: "@TacticsBreakdown",
    content: "Interesting tactical shift from Spurs. Moving to a 5-3-2 to contain City's wingers. Let's see if it works.",
    platform: "twitter",
    sentiment: "neutral",
    sentimentScore: 55,
    likes: 567,
    shares: 89,
    views: 8900,
    timestamp: "5m ago"
  },
  {
    id: "4",
    author: "@SpursSupporter",
    content: "Disappointing defensive work from Romero there. We need to be sharper if we want any chance here.",
    platform: "twitter",
    sentiment: "negative",
    sentimentScore: 32,
    likes: 234,
    shares: 45,
    views: 5600,
    timestamp: "6m ago"
  },
  {
    id: "5",
    author: "football.highlights",
    content: "De Bruyne's passing range today is absolutely insane. Every ball finds its target! 🎯",
    platform: "instagram",
    sentiment: "positive",
    sentimentScore: 88,
    likes: 4520,
    shares: 890,
    views: 78000,
    timestamp: "8m ago"
  },
  {
    id: "6",
    author: "r/MCFC subscriber",
    content: "This City squad depth is unreal. Foden coming on as a sub when most teams would start him.",
    platform: "reddit",
    sentiment: "positive",
    sentimentScore: 85,
    likes: 1240,
    shares: 234,
    views: 18000,
    timestamp: "10m ago"
  }
];

export function LiveSocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>(generateSamplePosts());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { data: liveMatches } = useLiveMatches();
  
  // Refresh function that syncs with the smart refresh system
  const refreshPosts = useCallback(() => {
    setIsRefreshing(true);
    setPosts(prev => {
      const newPosts = [...prev];
      // Simulate new posts and update engagement
      return newPosts.map((post, index) => ({
        ...post,
        likes: post.likes + Math.floor(Math.random() * 50),
        shares: post.shares + Math.floor(Math.random() * 10),
        views: post.views + Math.floor(Math.random() * 500),
        isNew: index === 0 && Math.random() > 0.5, // Randomly mark first post as new
      }));
    });
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);
  
  // Listen to query invalidations from the smart refresh system
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === "social-posts") {
        refreshPosts();
      }
    });
    
    return () => unsubscribe();
  }, [queryClient, refreshPosts]);

  // Also update based on live match status - faster updates during live matches
  useEffect(() => {
    const hasLiveMatches = (liveMatches?.length || 0) > 0;
    const interval = hasLiveMatches ? 30000 : 60000; // 30s during live, 60s otherwise
    
    const intervalId = setInterval(refreshPosts, interval);
    return () => clearInterval(intervalId);
  }, [liveMatches, refreshPosts]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-[hsl(var(--success))]";
      case "negative": return "text-[hsl(var(--destructive))]";
      default: return "text-muted-foreground";
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "😊";
      case "negative": return "😔";
      default: return "😐";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Radio className="w-5 h-5 text-[hsl(var(--success))] animate-pulse" />
            Live Social Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            )}
            <Badge variant="outline" className="text-xs">
              {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time fan posts from social media platforms
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author}</span>
                      <PlatformBadge platform={post.platform} />
                    </div>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>

                  {/* Content */}
                  <p className="text-sm mb-3 leading-relaxed">{post.content}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {formatNumber(post.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="w-3.5 h-3.5" />
                        {formatNumber(post.shares)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {formatNumber(post.views)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getSentimentColor(post.sentiment)}`}>
                        {getSentimentEmoji(post.sentiment)}
                      </span>
                      <SentimentIntensityBadge score={post.sentimentScore} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
