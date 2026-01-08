import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "./PlatformBadge";
import { TrendingUp, Eye, Heart, Repeat2, ExternalLink } from "lucide-react";

interface ViralPost {
  id: string;
  author: string;
  content: string;
  platform: "twitter" | "reddit" | "instagram";
  engagement: number;
  likes: number;
  shares: number;
  views: number;
  topic: string;
}

const viralPosts: ViralPost[] = [
  {
    id: "1",
    author: "@GaryLineker",
    content: "What a goal! Absolutely sensational strike from outside the box. That's goal of the season contender right there.",
    platform: "twitter",
    engagement: 156000,
    likes: 89000,
    shares: 45000,
    views: 2400000,
    topic: "Goal Celebration"
  },
  {
    id: "2",
    author: "r/soccer (viral)",
    content: "Post-match thread: The tactical masterclass we just witnessed might be the best football management display this season",
    platform: "reddit",
    engagement: 78000,
    likes: 34000,
    shares: 12000,
    views: 890000,
    topic: "Match Analysis"
  },
  {
    id: "3",
    author: "espn.football",
    content: "BREAKING: Last-minute winner sends fans into absolute delirium! 🏟️🔥 This is why we love football!",
    platform: "instagram",
    engagement: 234000,
    likes: 189000,
    shares: 45000,
    views: 5600000,
    topic: "Match Result"
  }
];

export function TopViralPosts() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
          Top Viral Posts
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Highest engagement posts from social media today
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {viralPosts.map((post, index) => (
          <div 
            key={post.id}
            className="p-4 rounded-lg border border-border bg-gradient-to-r from-card to-muted/20"
          >
            {/* Rank indicator */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">#{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.author}</span>
                  <PlatformBadge platform={post.platform} />
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  {post.topic}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">
                {formatNumber(post.engagement)} engagements
              </Badge>
            </div>

            {/* Content */}
            <p className="text-sm mb-3 leading-relaxed line-clamp-2">{post.content}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" />
                {formatNumber(post.likes)}
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 className="w-3.5 h-3.5 text-[hsl(var(--success))]" />
                {formatNumber(post.shares)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(post.views)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
