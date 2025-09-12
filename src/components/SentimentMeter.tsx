import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Heart, Frown, Meh } from "lucide-react";

interface SentimentMeterProps {
  positive: number;
  neutral: number;
  negative: number;
  totalMentions: number;
  trending: string[];
}

export function SentimentMeter({ positive, neutral, negative, totalMentions, trending }: SentimentMeterProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">Fan Pulse</span>
        </div>
        <span className="text-xs text-muted-foreground">{totalMentions.toLocaleString()} mentions</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-success" />
            <span className="text-sm">Positive</span>
          </div>
          <span className="text-sm font-bold text-success">{positive}%</span>
        </div>
        <Progress value={positive} className="h-2 bg-muted" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Meh className="w-4 h-4 text-warning" />
            <span className="text-sm">Neutral</span>
          </div>
          <span className="text-sm font-bold text-warning">{neutral}%</span>
        </div>
        <Progress value={neutral} className="h-2 bg-muted" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Frown className="w-4 h-4 text-destructive" />
            <span className="text-sm">Negative</span>
          </div>
          <span className="text-sm font-bold text-destructive">{negative}%</span>
        </div>
        <Progress value={negative} className="h-2 bg-muted" />
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-xs font-medium text-muted-foreground mb-2 block">Trending Topics</span>
        <div className="flex flex-wrap gap-2">
          {trending.map((topic, index) => (
            <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              #{topic}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}