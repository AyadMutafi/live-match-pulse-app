import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, History, Newspaper, Target, TrendingUp, TrendingDown } from "lucide-react";

interface HistoricalData {
  head_to_head: { home_wins: number; away_wins: number; draws: number; total_games: number };
  recent_form: { home_form: number; away_form: number }; // percentage
  home_advantage: number; // percentage
}

interface NewsImpact {
  headline: string;
  impact: "positive" | "negative" | "neutral";
  team: "home" | "away";
  confidence: number;
}

interface EnhancedPredictionProps {
  homeTeam: string;
  awayTeam: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  aiInsight: string;
  historical: HistoricalData;
  newsImpacts: NewsImpact[];
  keyFactors: { factor: string; impact: number; description: string }[];
}

export function EnhancedPrediction({ 
  homeTeam, 
  awayTeam, 
  homeWin, 
  draw, 
  awayWin, 
  confidence, 
  aiInsight,
  historical,
  newsImpacts,
  keyFactors
}: EnhancedPredictionProps) {
  const maxProb = Math.max(homeWin, draw, awayWin);
  const prediction = homeWin === maxProb ? homeTeam : awayWin === maxProb ? awayTeam : "Draw";
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-success";
      case "negative": return "text-destructive";
      default: return "text-warning";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive": return TrendingUp;
      case "negative": return TrendingDown;
      default: return Target;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-ai-green" />
            <span className="font-semibold text-sm">Enhanced AI Prediction</span>
          </div>
          <Badge variant="outline" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {confidence}% Confidence
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{homeTeam} Win</span>
            <span className="text-sm font-bold text-mancity-blue">{homeWin}%</span>
          </div>
          <Progress value={homeWin} className="h-2 bg-muted" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Draw</span>
            <span className="text-sm font-bold text-warning">{draw}%</span>
          </div>
          <Progress value={draw} className="h-2 bg-muted" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{awayTeam} Win</span>
            <span className="text-sm font-bold text-tottenham-purple">{awayWin}%</span>
          </div>
          <Progress value={awayWin} className="h-2 bg-muted" />
        </div>
        
        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-ai-green rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-ai-green">AI Insight</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{aiInsight}</p>
        </div>
        
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Most Likely: </span>
          <span className="font-bold text-primary">{prediction}</span>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Historical Analysis</span>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-mancity-blue">{historical.head_to_head.home_wins}</div>
              <div className="text-xs text-muted-foreground">{homeTeam} Wins</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-warning">{historical.head_to_head.draws}</div>
              <div className="text-xs text-muted-foreground">Draws</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-tottenham-purple">{historical.head_to_head.away_wins}</div>
              <div className="text-xs text-muted-foreground">{awayTeam} Wins</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Recent Form ({homeTeam})</span>
              <span className="text-sm font-bold text-mancity-blue">{historical.recent_form.home_form}%</span>
            </div>
            <Progress value={historical.recent_form.home_form} className="h-2 bg-muted" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Recent Form ({awayTeam})</span>
              <span className="text-sm font-bold text-tottenham-purple">{historical.recent_form.away_form}%</span>
            </div>
            <Progress value={historical.recent_form.away_form} className="h-2 bg-muted" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Home Advantage</span>
              <span className="text-sm font-bold text-success">{historical.home_advantage}%</span>
            </div>
            <Progress value={historical.home_advantage} className="h-2 bg-muted" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Newspaper className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">News Impact Analysis</span>
        </div>
        
        <div className="space-y-3">
          {newsImpacts.map((news, index) => {
            const ImpactIcon = getImpactIcon(news.impact);
            return (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ImpactIcon className={`w-4 h-4 ${getImpactColor(news.impact)}`} />
                    <Badge variant="outline" className="text-xs">
                      {news.team === "home" ? homeTeam : awayTeam}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{news.confidence}% impact</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{news.headline}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-ai-green" />
          <span className="font-semibold text-sm">Key Prediction Factors</span>
        </div>
        
        <div className="space-y-3">
          {keyFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{factor.factor}</span>
                <span className="text-sm font-bold text-primary">{factor.impact > 0 ? '+' : ''}{factor.impact}%</span>
              </div>
              <Progress 
                value={Math.abs(factor.impact)} 
                className={`h-2 bg-muted ${factor.impact > 0 ? '[&>*]:bg-success' : '[&>*]:bg-destructive'}`} 
              />
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}