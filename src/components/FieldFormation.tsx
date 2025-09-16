import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Target, Shield, Zap } from "lucide-react";

interface Player {
  id: string;
  name: string;
  position: string;
  rating: number;
  photo?: string;
  emoji: string;
  stats: {
    goals?: number;
    assists?: number;
    saves?: number;
    cleanSheets?: number;
    tackles?: number;
    passAccuracy?: number;
  };
  team: string;
  league: string;
}

interface FieldFormationProps {
  teamOfWeek: Player[];
  formation: string;
}

export function FieldFormation({ teamOfWeek, formation }: FieldFormationProps) {
  // Formation layouts (4-3-3 example)
  const getFormationLayout = (formation: string) => {
    switch (formation) {
      case "4-3-3":
        return {
          goalkeeper: [0],
          defenders: [1, 2, 3, 4],
          midfielders: [5, 6, 7],
          forwards: [8, 9, 10]
        };
      case "4-4-2":
        return {
          goalkeeper: [0],
          defenders: [1, 2, 3, 4],
          midfielders: [5, 6, 7, 8],
          forwards: [9, 10]
        };
      default:
        return {
          goalkeeper: [0],
          defenders: [1, 2, 3, 4],
          midfielders: [5, 6, 7],
          forwards: [8, 9, 10]
        };
    }
  };

  const layout = getFormationLayout(formation);

  const PlayerCard = ({ player, index }: { player: Player; index: number }) => {
    const getPositionIcon = (position: string) => {
      if (position.includes("Forward") || position.includes("Striker")) return Target;
      if (position.includes("Midfielder")) return Zap;
      if (position.includes("Defender")) return Shield;
      return Star;
    };

    const Icon = getPositionIcon(player.position);

    return (
      <TooltipProvider key={player.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative flex flex-col items-center space-y-2 cursor-pointer group">
              {/* Player Picture with Rating Circle */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {player.photo ? (
                    <img 
                      src={player.photo} 
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl">{player.emoji}</div>
                  )}
                </div>
                {/* Rating Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {player.rating}
                </div>
              </div>
              
              {/* Player Name */}
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground max-w-16 truncate">
                  {player.name.split(' ').pop()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {player.team}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-64 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <div className="text-2xl">{player.emoji}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.position}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {player.team} • {player.league}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {player.stats.goals !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-primary" />
                    <span>Goals: {player.stats.goals}</span>
                  </div>
                )}
                {player.stats.assists !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-secondary" />
                    <span>Assists: {player.stats.assists}</span>
                  </div>
                )}
                {player.stats.saves !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-accent" />
                    <span>Saves: {player.stats.saves}</span>
                  </div>
                )}
                {player.stats.cleanSheets !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-success" />
                    <span>Clean Sheets: {player.stats.cleanSheets}</span>
                  </div>
                )}
                {player.stats.tackles !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-destructive" />
                    <span>Tackles: {player.stats.tackles}</span>
                  </div>
                )}
                {player.stats.passAccuracy !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-warning" />
                    <span>Pass: {player.stats.passAccuracy}%</span>
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Team of the Week</h3>
        <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
          Formation: {formation}
        </Badge>
      </div>
      
      {/* Football Field */}
      <div className="relative bg-gradient-to-b from-green-400 to-green-500 rounded-lg p-4 min-h-80 overflow-hidden">
        {/* Field Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full border-2 border-white rounded-lg">
            <div className="w-1/2 h-full border-r-2 border-white"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>
        </div>
        
        {/* Players positioned on field */}
        <div className="relative h-full flex flex-col justify-between py-4">
          {/* Forwards */}
          <div className="flex justify-center space-x-8">
            {layout.forwards.map(index => 
              teamOfWeek[index] && <PlayerCard key={index} player={teamOfWeek[index]} index={index} />
            )}
          </div>
          
          {/* Midfielders */}
          <div className="flex justify-center space-x-6">
            {layout.midfielders.map(index => 
              teamOfWeek[index] && <PlayerCard key={index} player={teamOfWeek[index]} index={index} />
            )}
          </div>
          
          {/* Defenders */}
          <div className="flex justify-center space-x-4">
            {layout.defenders.map(index => 
              teamOfWeek[index] && <PlayerCard key={index} player={teamOfWeek[index]} index={index} />
            )}
          </div>
          
          {/* Goalkeeper */}
          <div className="flex justify-center">
            {layout.goalkeeper.map(index => 
              teamOfWeek[index] && <PlayerCard key={index} player={teamOfWeek[index]} index={index} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
