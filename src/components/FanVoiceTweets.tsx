import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Repeat2, ExternalLink, ChevronDown, ThumbsUp } from "lucide-react";

interface FanTweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  sentiment: number;
  sentimentEmoji: string;
  likes: number;
  retweets: number;
  replies: number;
  agrees: number;
  timeAgo: string;
}

interface FanVoiceTweetsProps {
  teamName: string;
  tweets?: FanTweet[];
}

const MOCK_TWEETS: FanTweet[] = [
  {
    id: "1", author: "Red Devil Forever", handle: "@RedDevil4Life",
    content: "Bruno Fernandes is the heartbeat of this team! Every time he gets the ball, I feel something special is about to happen! 🔥😍 #MUFC",
    sentiment: 94, sentimentEmoji: "😍", likes: 2345, retweets: 567, replies: 89, agrees: 1234, timeAgo: "2h",
  },
  {
    id: "2", author: "MUFC Fan", handle: "@MUFC_ArsenalFan",
    content: "That Rashford goal made me jump off my seat! This is why I love football! Pure emotion! 🔥⚽ #MUFC #GGMU",
    sentiment: 96, sentimentEmoji: "🔥", likes: 5678, retweets: 1234, replies: 156, agrees: 3456, timeAgo: "3h",
  },
  {
    id: "3", author: "United Till I Die", handle: "@UTD_TillIDie",
    content: "The atmosphere at Old Trafford tonight was absolutely electric! Haven't felt this buzz since the Fergie days 🏟️🔴 #MUFC",
    sentiment: 88, sentimentEmoji: "😍", likes: 1890, retweets: 423, replies: 67, agrees: 987, timeAgo: "4h",
  },
  {
    id: "4", author: "Football Thoughts", handle: "@FootballThinks",
    content: "Honestly, the defensive improvements are clear to see. Martinez is a wall back there. Quietly becoming world class 🛡️💪",
    sentiment: 82, sentimentEmoji: "🙂", likes: 934, retweets: 201, replies: 34, agrees: 567, timeAgo: "5h",
  },
];

function formatNumber(num: number) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getSentimentColor(score: number) {
  if (score >= 80) return "text-[hsl(var(--success))]";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-muted-foreground";
  return "text-destructive";
}

export function FanVoiceTweets({ teamName, tweets = MOCK_TWEETS }: FanVoiceTweetsProps) {
  const [expanded, setExpanded] = useState(false);
  const displayTweets = expanded ? tweets : tweets.slice(0, 2);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-lg">🗣️</span>
          What Fans Are Saying
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Trending now for {teamName}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence initial={false}>
          {displayTweets.map((tweet, i) => (
            <motion.div
              key={tweet.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-xl p-4 space-y-3"
            >
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {tweet.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tweet.author}</p>
                    <p className="text-[10px] text-muted-foreground">{tweet.handle} · {tweet.timeAgo}</p>
                  </div>
                </div>
                <span className="font-bold text-sm">𝕏</span>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-foreground">{tweet.content}</p>

              {/* Sentiment */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{tweet.sentimentEmoji}</span>
                <span className={`text-xs font-semibold ${getSentimentColor(tweet.sentiment)}`}>
                  {tweet.sentiment}% positive sentiment
                </span>
              </div>

              {/* Engagement */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-destructive" /> {formatNumber(tweet.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat2 className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> {formatNumber(tweet.retweets)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /> {formatNumber(tweet.replies)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1 flex-1">
                  <ThumbsUp className="w-3 h-3" /> Agree {formatNumber(tweet.agrees)}
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1 flex-1">
                  <MessageCircle className="w-3 h-3" /> Discuss
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1 flex-1">
                  <ExternalLink className="w-3 h-3" /> Share
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tweets.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Show Less" : `View ${tweets.length - 2} More Tweets`}
          </Button>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
            <span className="font-bold text-sm">𝕏</span> Post Your Thoughts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
