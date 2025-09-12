import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp } from "lucide-react";

interface PredictionCardProps {
  homeTeam: string;
  awayTeam: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  aiInsight: string;
}

export function PredictionCard({ 
  homeTeam, 
  awayTeam, 
  homeWin, 
  draw, 
  awayWin, 
  confidence, 
  aiInsight 
}: PredictionCardProps) {
  const maxProb = Math.max(homeWin, draw, awayWin);
  const prediction = homeWin === maxProb ? homeTeam : awayWin === maxProb ? awayTeam : "Draw";
  
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-ai-green" />
          <span className="font-semibold text-sm">AI Prediction</span>
        </div>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
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
      
      <div className="bg-muted rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-ai-green rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-ai-green">AI Insight</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{aiInsight}</p>
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-sm text-muted-foreground">Most Likely: </span>
        <span className="font-bold text-primary">{prediction}</span>
      </div>
    </Card>
  );
}