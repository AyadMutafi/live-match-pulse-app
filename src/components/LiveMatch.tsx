import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";

interface Team {
  name: string;
  logo: string;
  score: number;
  color: string;
}

interface LiveMatchProps {
  homeTeam: Team;
  awayTeam: Team;
  minute: number;
  status: string;
  isLive?: boolean;
}

export function LiveMatch({ homeTeam, awayTeam, minute, status, isLive = false }: LiveMatchProps) {
  return (
    <Card className="p-4 bg-card border-border hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs">
          {isLive && <Zap className="w-3 h-3 mr-1" />}
          {status}
        </Badge>
        {isLive && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {minute}'
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: homeTeam.color }}
            >
              {homeTeam.name.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-medium text-sm">{homeTeam.name}</span>
          </div>
          <span className="text-2xl font-bold text-primary">{homeTeam.score}</span>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-full h-px bg-border"></div>
          <span className="px-3 text-xs text-muted-foreground bg-card">VS</span>
          <div className="w-full h-px bg-border"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: awayTeam.color }}
            >
              {awayTeam.name.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-medium text-sm">{awayTeam.name}</span>
          </div>
          <span className="text-2xl font-bold text-primary">{awayTeam.score}</span>
        </div>
      </div>
    </Card>
  );
}