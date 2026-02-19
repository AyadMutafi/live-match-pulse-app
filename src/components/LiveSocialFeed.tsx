import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformBadge } from "./PlatformBadge";
import { SentimentIntensityBadge } from "./SentimentIntensityBadge";
import { Radio, Heart, Repeat2, Eye, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
}

function mapDbPosts(dbPosts: any[]): SocialPost[] {
  return dbPosts.map((p) => {
    const rawScore = p.sentiment_score ?? 5;
    // DB stores 0-9.99, UI expects 0-100
    const score = Math.round(rawScore * 10);
    const sentiment = score >= 65 ? "positive" : score <= 35 ? "negative" : "neutral";
    const engagement = p.engagement_metrics as any || {};
    const postedAt = new Date(p.posted_at);
    const minutesAgo = Math.max(1, Math.floor((Date.now() - postedAt.getTime()) / 60000));
    const timestamp = minutesAgo < 60 ? `${minutesAgo}m ago` : minutesAgo < 1440 ? `${Math.floor(minutesAgo / 60)}h ago` : `${Math.floor(minutesAgo / 1440)}d ago`;

    return {
      id: p.id,
      author: p.author_handle || "Anonymous",
      content: p.content,
      platform: p.platform === "facebook" ? "twitter" : p.platform,
      sentiment,
      sentimentScore: score,
      likes: engagement.likes ?? Math.floor(Math.random() * 3000),
      shares: engagement.shares ?? Math.floor(Math.random() * 500),
      views: engagement.views ?? Math.floor(Math.random() * 50000),
      timestamp,
    };
  });
}

// Fallback sample posts when no DB data exists
const fallbackPosts: SocialPost[] = [
  { id: "f1", author: "@FootballFanatic", content: "What a match day! 🔥 The atmosphere is electric across all leagues today.", platform: "twitter", sentiment: "positive", sentimentScore: 88, likes: 2340, shares: 456, views: 45000, timestamp: "2m ago" },
  { id: "f2", author: "r/soccer user", content: "Incredible tactical display. The pressing game has been on another level this season.", platform: "reddit", sentiment: "positive", sentimentScore: 78, likes: 892, shares: 124, views: 12000, timestamp: "5m ago" },
  { id: "f3", author: "football.highlights", content: "This passing range today is insane. Every ball finds its target! 🎯", platform: "instagram", sentiment: "positive", sentimentScore: 85, likes: 4520, shares: 890, views: 78000, timestamp: "8m ago" },
];

export function LiveSocialFeed() {
  const { data: dbPosts, isLoading } = useQuery({
    queryKey: ["social-posts-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_posts")
        .select("*")
        .order("posted_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60 * 1000,
  });

  const posts = useMemo(() => {
    if (dbPosts && dbPosts.length > 0) return mapDbPosts(dbPosts);
    return fallbackPosts;
  }, [dbPosts]);

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
          <Badge variant="outline" className="text-xs">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {dbPosts && dbPosts.length > 0 ? "Real-time fan posts from social media" : "Sample fan posts — real data loading..."}
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author}</span>
                      <PlatformBadge platform={post.platform} />
                    </div>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(post.likes)}</span>
                      <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" />{formatNumber(post.shares)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(post.views)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getSentimentColor(post.sentiment)}`}>{getSentimentEmoji(post.sentiment)}</span>
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
