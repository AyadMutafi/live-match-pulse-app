import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, MessageCircle, Heart, Frown, Meh } from "lucide-react";

interface LanguageSentiment {
  language: string;
  code: string;
  positive: number;
  neutral: number;
  negative: number;
  totalPosts: number;
  trendingHashtags: string[];
}

interface MultiLanguageSentimentProps {
  languages: LanguageSentiment[];
  totalMentions: number;
}

export function MultiLanguageSentiment({ languages, totalMentions }: MultiLanguageSentimentProps) {
  const getOverallSentiment = () => {
    const total = languages.reduce((sum, lang) => sum + lang.totalPosts, 0);
    const positive = languages.reduce((sum, lang) => sum + (lang.positive * lang.totalPosts / 100), 0) / total * 100;
    const neutral = languages.reduce((sum, lang) => sum + (lang.neutral * lang.totalPosts / 100), 0) / total * 100;
    const negative = languages.reduce((sum, lang) => sum + (lang.negative * lang.totalPosts / 100), 0) / total * 100;
    
    return { positive, neutral, negative };
  };

  const overall = getOverallSentiment();

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">Global Fan Sentiment</span>
        </div>
        <span className="text-xs text-muted-foreground">{totalMentions.toLocaleString()} total posts</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-success" />
            <span className="text-sm">Overall Positive</span>
          </div>
          <span className="text-sm font-bold text-success">{Math.round(overall.positive)}%</span>
        </div>
        <Progress value={overall.positive} className="h-2 bg-muted" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Meh className="w-4 h-4 text-warning" />
            <span className="text-sm">Overall Neutral</span>
          </div>
          <span className="text-sm font-bold text-warning">{Math.round(overall.neutral)}%</span>
        </div>
        <Progress value={overall.neutral} className="h-2 bg-muted" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Frown className="w-4 h-4 text-destructive" />
            <span className="text-sm">Overall Negative</span>
          </div>
          <span className="text-sm font-bold text-destructive">{Math.round(overall.negative)}%</span>
        </div>
        <Progress value={overall.negative} className="h-2 bg-muted" />
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium">By Language</span>
        {languages.map((lang, index) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {lang.code.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium">{lang.language}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MessageCircle className="w-3 h-3" />
                <span>{lang.totalPosts.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mb-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-success">Positive</span>
                  <span className="text-success">{lang.positive}%</span>
                </div>
                <Progress value={lang.positive} className="h-1" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-warning">Neutral</span>
                  <span className="text-warning">{lang.neutral}%</span>
                </div>
                <Progress value={lang.neutral} className="h-1" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-destructive">Negative</span>
                  <span className="text-destructive">{lang.negative}%</span>
                </div>
                <Progress value={lang.negative} className="h-1" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {lang.trendingHashtags.slice(0, 3).map((hashtag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}