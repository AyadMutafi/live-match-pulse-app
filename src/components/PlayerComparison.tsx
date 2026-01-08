import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, TrendingUp, TrendingDown, Star } from "lucide-react";
import { PlayerRating, getRatingBadge, getRatingColor, calculateStarRating } from "@/lib/playerRatings";

interface PlayerComparisonProps {
  player1: PlayerRating;
  player2: PlayerRating;
  onClose: () => void;
}

export function PlayerComparison({ player1, player2, onClose }: PlayerComparisonProps) {
  const badge1 = getRatingBadge(player1.rating);
  const badge2 = getRatingBadge(player2.rating);
  
  const comparisons = [
    { 
      label: "Overall Rating", 
      value1: player1.rating, 
      value2: player2.rating,
      format: (v: number) => v.toFixed(1)
    },
    { 
      label: "Fan Mentions", 
      value1: player1.mentions, 
      value2: player2.mentions,
      format: (v: number) => v.toString()
    },
    { 
      label: "Positive Reactions", 
      value1: player1.positiveReactions, 
      value2: player2.positiveReactions,
      format: (v: number) => v.toString()
    },
    { 
      label: "Matches Played", 
      value1: player1.matchesPlayed, 
      value2: player2.matchesPlayed,
      format: (v: number) => v.toString()
    },
    { 
      label: "Goals", 
      value1: player1.goals || 0, 
      value2: player2.goals || 0,
      format: (v: number) => v.toString()
    },
    { 
      label: "Assists", 
      value1: player1.assists || 0, 
      value2: player2.assists || 0,
      format: (v: number) => v.toString()
    },
  ];

  const renderStars = (rating: number) => {
    const stars = calculateStarRating(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array(stars.filled).fill(0).map((_, i) => (
          <Star key={`f-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {stars.half && (
          <div className="relative">
            <Star className="w-3 h-3 text-muted-foreground" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {Array(stars.empty).fill(0).map((_, i) => (
          <Star key={`e-${i}`} className="w-3 h-3 text-muted-foreground" />
        ))}
      </div>
    );
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Player Comparison</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Player Headers */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Player 1 */}
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${badge1.bgColor}`}>
            {player1.positionNumber}
          </div>
          <div className="mt-2 font-semibold text-sm truncate">{player1.name}</div>
          <div className="text-xs text-muted-foreground">{player1.teamName}</div>
          <Badge variant="outline" className="mt-1 text-xs">
            {player1.position}
          </Badge>
          <div className="mt-2">
            {renderStars(player1.rating)}
          </div>
          <div className={`text-2xl font-bold mt-1 ${getRatingColor(player1.rating)}`}>
            {player1.rating.toFixed(1)}
          </div>
          <Badge className={`mt-1 ${badge1.bgColor} ${badge1.color} border-0`}>
            {badge1.emoji} {badge1.label}
          </Badge>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
            VS
          </div>
        </div>

        {/* Player 2 */}
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${badge2.bgColor}`}>
            {player2.positionNumber}
          </div>
          <div className="mt-2 font-semibold text-sm truncate">{player2.name}</div>
          <div className="text-xs text-muted-foreground">{player2.teamName}</div>
          <Badge variant="outline" className="mt-1 text-xs">
            {player2.position}
          </Badge>
          <div className="mt-2">
            {renderStars(player2.rating)}
          </div>
          <div className={`text-2xl font-bold mt-1 ${getRatingColor(player2.rating)}`}>
            {player2.rating.toFixed(1)}
          </div>
          <Badge className={`mt-1 ${badge2.bgColor} ${badge2.color} border-0`}>
            {badge2.emoji} {badge2.label}
          </Badge>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="space-y-3">
        {comparisons.map((stat) => {
          const diff = stat.value1 - stat.value2;
          const maxVal = Math.max(stat.value1, stat.value2) || 1;
          
          return (
            <div key={stat.label} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stat.format(stat.value1)}</span>
                <span className="font-medium text-foreground">{stat.label}</span>
                <span>{stat.format(stat.value2)}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Progress 
                  value={(stat.value1 / maxVal) * 100} 
                  className="h-2 flex-1 [&>div]:bg-primary"
                />
                <Progress 
                  value={(stat.value2 / maxVal) * 100} 
                  className="h-2 flex-1 [&>div]:bg-accent"
                />
              </div>
              {diff !== 0 && (
                <div className="flex justify-center">
                  <span className={`text-xs flex items-center gap-1 ${diff > 0 ? "text-green-500" : "text-red-500"}`}>
                    {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {player1.name.split(" ")[0]} {diff > 0 ? "+" : ""}{stat.format(diff)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Winner */}
      {player1.rating !== player2.rating && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <span className="text-sm text-muted-foreground">Higher Rated: </span>
          <span className="font-semibold text-primary">
            {player1.rating > player2.rating ? player1.name : player2.name}
          </span>
        </div>
      )}
    </Card>
  );
}
