import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  SENTIMENT_SCALE,
  MatchPlayer,
  FanPlayerRating,
  savePlayerRatings,
} from "@/lib/fanRatings";
import { toast } from "@/hooks/use-toast";

interface QuickRateModeProps {
  matchId: string;
  matchTitle: string;
  homeTeam: { name: string; id: string };
  awayTeam: { name: string; id: string };
  homePlayers: MatchPlayer[];
  awayPlayers: MatchPlayer[];
  onComplete: () => void;
  onClose: () => void;
}

export function QuickRateMode({
  matchId,
  matchTitle,
  homeTeam,
  awayTeam,
  homePlayers,
  awayPlayers,
  onComplete,
  onClose,
}: QuickRateModeProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const setRating = (playerId: string, sentimentIdx: number) => {
    setRatings(prev => ({ ...prev, [playerId]: sentimentIdx }));
  };

  const ratedCount = Object.keys(ratings).length;
  const totalPlayers = homePlayers.length + awayPlayers.length;

  const submit = () => {
    const allRatings: FanPlayerRating[] = Object.entries(ratings).map(([playerId, idx]) => {
      const allPlayers = [...homePlayers, ...awayPlayers];
      const player = allPlayers.find(p => p.id === playerId);
      return {
        playerId,
        playerName: player?.name || "Unknown",
        sentiment: idx,
        tags: [],
        timestamp: Date.now(),
        matchId,
      };
    });
    savePlayerRatings(matchId, allRatings);
    toast({ title: "Ratings submitted! ⚽", description: `You rated ${ratedCount} players` });
    onComplete();
  };

  const renderTeamPlayers = (players: MatchPlayer[]) => (
    <div className="space-y-1.5">
      {players.map(player => (
        <div
          key={player.id}
          className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-xs font-medium w-28 truncate text-foreground">{player.name}</span>
          <div className="flex gap-1 flex-1">
            {SENTIMENT_SCALE.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setRating(player.id, idx)}
                className={`w-8 h-8 rounded-lg text-base transition-all flex items-center justify-center ${
                  ratings[player.id] === idx
                    ? "bg-primary/20 scale-110 ring-2 ring-primary"
                    : "hover:bg-muted hover:scale-105"
                }`}
                title={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
          <span className="text-lg w-8 text-center">
            {ratings[player.id] !== undefined ? SENTIMENT_SCALE[ratings[player.id]].emoji : "—"}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-bold text-foreground">QUICK RATE</h2>
            <p className="text-xs text-muted-foreground">{matchTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <p className="px-4 pt-2 text-sm text-muted-foreground">
        Tap how you feel about each player:
      </p>

      {/* Players */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Home Team */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs font-bold">{homeTeam.name}</Badge>
          </div>
          {renderTeamPlayers(homePlayers)}
        </div>

        {/* Away Team */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-bold">{awayTeam.name}</Badge>
          </div>
          {renderTeamPlayers(awayPlayers)}
        </div>
      </div>

      {/* Submit */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>⏱️ Takes 30 seconds</span>
          <span>{ratedCount}/{totalPlayers} rated</span>
        </div>
        <Button className="w-full" disabled={ratedCount === 0} onClick={submit}>
          Submit All Ratings ({ratedCount})
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          Your voice shapes player legacy
        </p>
      </div>
    </div>
  );
}
