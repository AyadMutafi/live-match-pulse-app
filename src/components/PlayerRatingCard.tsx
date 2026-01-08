import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, TrendingUp, TrendingDown, MessageCircle, Share2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayerRating, 
  getRatingBadge, 
  getRatingColor, 
  getRatingBgColor, 
  calculateStarRating, 
  getTrendIndicator 
} from "@/lib/playerRatings";

interface PlayerRatingCardProps {
  player: PlayerRating;
  showDetails?: boolean;
  onCompare?: (player: PlayerRating) => void;
  compareMode?: boolean;
  isSelected?: boolean;
}

export function PlayerRatingCard({ 
  player, 
  showDetails = false, 
  onCompare,
  compareMode = false,
  isSelected = false 
}: PlayerRatingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const badge = getRatingBadge(player.rating);
  const ratingColor = getRatingColor(player.rating);
  const ratingBgColor = getRatingBgColor(player.rating);
  const stars = calculateStarRating(player.rating);
  const trend = getTrendIndicator(player.rating, player.previousRating);

  const renderStars = () => {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card 
        className={`p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
          isSelected ? "ring-2 ring-primary" : ""
        } ${compareMode ? "hover:ring-2 hover:ring-primary/50" : ""}`}
        onClick={() => {
          if (compareMode && onCompare) {
            onCompare(player);
          } else {
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Player Avatar/Number */}
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${ratingBgColor}`}>
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className={`text-lg font-bold ${ratingColor}`}>{player.positionNumber}</span>
            )}
            <Badge 
              variant="secondary" 
              className="absolute -bottom-1 -right-1 text-[10px] px-1 py-0 h-4"
            >
              {player.position}
            </Badge>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{player.name}</span>
              {trend && (
                <span className={`text-xs flex items-center ${trend.color}`}>
                  {trend.icon === "↑" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend.change.toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {renderStars()}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {player.mentions}
              </span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className={`text-xl font-bold ${ratingColor}`}>
              {player.rating.toFixed(1)}
            </div>
            <Badge variant="outline" className={`text-[10px] ${badge.bgColor} ${badge.color} border-0`}>
              {badge.emoji} {badge.label}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <Progress 
            value={player.rating * 10} 
            className="h-1.5"
          />
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {(expanded || showDetails) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border space-y-3">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Positive</div>
                    <div className="font-semibold text-green-500">{player.positiveReactions}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Negative</div>
                    <div className="font-semibold text-red-500">{player.negativeReactions}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Matches</div>
                    <div className="font-semibold">{player.matchesPlayed}</div>
                  </div>
                </div>

                {/* Match Impact */}
                {(player.goals || player.assists || player.cleanSheets) && (
                  <div className="flex gap-2 flex-wrap">
                    {player.goals ? (
                      <Badge variant="secondary" className="text-xs">
                        ⚽ {player.goals} Goal{player.goals > 1 ? "s" : ""}
                      </Badge>
                    ) : null}
                    {player.assists ? (
                      <Badge variant="secondary" className="text-xs">
                        🎯 {player.assists} Assist{player.assists > 1 ? "s" : ""}
                      </Badge>
                    ) : null}
                    {player.cleanSheets ? (
                      <Badge variant="secondary" className="text-xs">
                        🧤 {player.cleanSheets} Clean Sheet{player.cleanSheets > 1 ? "s" : ""}
                      </Badge>
                    ) : null}
                  </div>
                )}

                {/* Key Phrases */}
                {player.keyPhrases.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Fan Sentiment:</div>
                    <div className="flex flex-wrap gap-1">
                      {player.keyPhrases.map((phrase, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          "{phrase}"
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  {onCompare && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompare(player);
                      }}
                    >
                      <User className="w-3 h-3 mr-1" />
                      Compare
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
