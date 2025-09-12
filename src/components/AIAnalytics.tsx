import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, MessageCircle, AlertCircle } from "lucide-react";

interface Tweet {
  id: string;
  text: string;
  author: string;
  engagement: number;
  sentiment: "positive" | "negative" | "neutral";
  influence_score: number;
}

interface AIAnalyticsProps {
  tweets: Tweet[];
  keyInsights: string[];
  trendingTopics: { topic: string; volume: number; sentiment: number }[];
  influencerActivity: { name: string; followers: number; recent_posts: number }[];
}

export function AIAnalytics({ tweets, keyInsights, trendingTopics, influencerActivity }: AIAnalyticsProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-success";
      case "negative": return "text-destructive";
      default: return "text-warning";
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-success/10 text-success";
      case "negative": return "bg-destructive/10 text-destructive";
      default: return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-ai-green" />
          <span className="font-semibold text-sm">AI Tweet Analysis</span>
          <Badge variant="outline" className="text-xs bg-ai-green/10 text-ai-green">Real-time</Badge>
        </div>
        
        <div className="space-y-3">
          {tweets.slice(0, 3).map((tweet) => (
            <div key={tweet.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-muted-foreground">@{tweet.author}</span>
                  <Badge className={`text-xs ${getSentimentBadge(tweet.sentiment)}`}>
                    {tweet.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MessageCircle className="w-3 h-3" />
                  <span>{tweet.engagement}</span>
                </div>
              </div>
              <p className="text-sm text-foreground line-clamp-2">{tweet.text}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Influence Score: {tweet.influence_score}/100</span>
                <div className="w-16 h-1 bg-muted-foreground/20 rounded-full">
                  <div 
                    className="h-full bg-ai-green rounded-full transition-all duration-300"
                    style={{ width: `${tweet.influence_score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">Trending Topics</span>
        </div>
        
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">#{topic.topic}</span>
                <Badge variant="outline" className="text-xs">
                  {topic.volume.toLocaleString()} posts
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  topic.sentiment > 60 ? "bg-success" : 
                  topic.sentiment < 40 ? "bg-destructive" : "bg-warning"
                }`}></div>
                <span className="text-xs text-muted-foreground">{topic.sentiment}% positive</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Key AI Insights</span>
        </div>
        
        <div className="space-y-2">
          {keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-ai-green rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}