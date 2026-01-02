import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat2, Twitter, Instagram, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FanPost {
  id: string;
  author: string;
  handle: string;
  content: string;
  sentiment: number;
  platform: "twitter" | "instagram" | "facebook";
  likes: number;
  retweets: number;
  timestamp: string;
  isNew?: boolean;
}

interface LiveFanFeedProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

const MOCK_POSTS: FanPost[] = [
  {
    id: "1",
    author: "FootballFan92",
    handle: "@footballfan92",
    content: "WHAT A SAVE! This keeper is on fire today! 🧤🔥",
    sentiment: 85,
    platform: "twitter",
    likes: 234,
    retweets: 45,
    timestamp: "Just now",
  },
  {
    id: "2",
    author: "SerieAEnthusiast",
    handle: "@seriea_fan",
    content: "The atmosphere in the stadium is incredible! You can feel the tension through the screen 😍",
    sentiment: 78,
    platform: "twitter",
    likes: 156,
    retweets: 23,
    timestamp: "1m ago",
  },
  {
    id: "3",
    author: "TacticalAnalyst",
    handle: "@tactical_view",
    content: "That midfield pressing is relentless. They've won the ball back 15 times in their own half already!",
    sentiment: 72,
    platform: "twitter",
    likes: 89,
    retweets: 34,
    timestamp: "2m ago",
  },
  {
    id: "4",
    author: "MatchdayVibes",
    handle: "@matchday_vibes",
    content: "Come on!! We need this goal! The pressure is immense right now 😬",
    sentiment: 55,
    platform: "instagram",
    likes: 312,
    retweets: 0,
    timestamp: "3m ago",
  },
  {
    id: "5",
    author: "SoccerStats",
    handle: "@soccer_stats",
    content: "72% possession but still can't break them down. Need more creativity in the final third.",
    sentiment: 45,
    platform: "twitter",
    likes: 67,
    retweets: 12,
    timestamp: "4m ago",
  },
];

const NEW_POSTS = [
  {
    id: "new1",
    author: "GoalMachine",
    handle: "@goal_machine",
    content: "GOOOOOAL! I CAN'T BELIEVE IT! 🚀⚽ What a strike!",
    sentiment: 95,
    platform: "twitter" as const,
    likes: 0,
    retweets: 0,
    timestamp: "Just now",
  },
  {
    id: "new2",
    author: "MatchReactor",
    handle: "@match_reactor",
    content: "This ref is having a mare! How is that not a penalty?! 😤",
    sentiment: 25,
    platform: "twitter" as const,
    likes: 0,
    retweets: 0,
    timestamp: "Just now",
  },
  {
    id: "new3",
    author: "FootballPoet",
    handle: "@football_poet",
    content: "Beautiful football being played here. This is why we love the game ❤️",
    sentiment: 88,
    platform: "instagram" as const,
    likes: 0,
    retweets: 0,
    timestamp: "Just now",
  },
];

export function LiveFanFeed({ matchId, homeTeam, awayTeam }: LiveFanFeedProps) {
  const [posts, setPosts] = useState<FanPost[]>(MOCK_POSTS);
  const [newPostCount, setNewPostCount] = useState(0);

  useEffect(() => {
    // Simulate new posts coming in
    const interval = setInterval(() => {
      const randomPost = NEW_POSTS[Math.floor(Math.random() * NEW_POSTS.length)];
      const newPost: FanPost = {
        ...randomPost,
        id: `${Date.now()}`,
        isNew: true,
        content: randomPost.content.replace("team", Math.random() > 0.5 ? homeTeam : awayTeam),
      };
      
      setPosts(prev => [newPost, ...prev.slice(0, 9)]);
      setNewPostCount(prev => prev + 1);
    }, 15000); // New post every 15 seconds

    return () => clearInterval(interval);
  }, [homeTeam, awayTeam]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return "bg-green-500/10 border-green-500/30 text-green-500";
    if (sentiment >= 50) return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500";
    if (sentiment >= 25) return "bg-orange-500/10 border-orange-500/30 text-orange-500";
    return "bg-red-500/10 border-red-500/30 text-red-500";
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🔥";
    if (sentiment >= 65) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 35) return "😟";
    return "😤";
  };

  const getPlatformIcon = (platform: FanPost["platform"]) => {
    switch (platform) {
      case "twitter": return <Twitter className="h-3 w-3" />;
      case "instagram": return <Instagram className="h-3 w-3" />;
      default: return <MessageCircle className="h-3 w-3" />;
    }
  };

  const averageSentiment = posts.reduce((a, b) => a + b.sentiment, 0) / posts.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            What Fans Are Saying Now
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            <span className="mr-1 h-2 w-2 rounded-full bg-white inline-block" />
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mood:</span>
            <span className={averageSentiment >= 50 ? "text-green-500" : "text-red-500"}>
              {getSentimentEmoji(averageSentiment)} {averageSentiment.toFixed(0)}%
            </span>
          </div>
          <Badge variant="secondary">{newPostCount} new posts</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`mb-3 p-3 rounded-lg border ${
                  post.isNew ? "ring-2 ring-primary ring-offset-2" : ""
                } ${getSentimentColor(post.sentiment)}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {post.author.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.handle}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getPlatformIcon(post.platform)}
                      </div>
                      {post.isNew && (
                        <Badge variant="default" className="text-xs py-0">NEW</Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3" />
                        {post.retweets}
                      </span>
                      <span>{post.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        {getSentimentEmoji(post.sentiment)} {post.sentiment}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
