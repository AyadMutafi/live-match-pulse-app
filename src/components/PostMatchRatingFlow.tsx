import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, SkipForward, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SENTIMENT_SCALE,
  RATING_TAGS,
  MatchPlayer,
  FanPlayerRating,
  savePlayerRatings,
} from "@/lib/fanRatings";

interface PostMatchRatingFlowProps {
  matchId: string;
  matchTitle: string;
  matchSubtitle: string;
  players: MatchPlayer[];
  onComplete: () => void;
  onClose: () => void;
}

export function PostMatchRatingFlow({
  matchId,
  matchTitle,
  matchSubtitle,
  players,
  onComplete,
  onClose,
}: PostMatchRatingFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSentiment, setSelectedSentiment] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState<FanPlayerRating[]>([]);

  const currentPlayer = players[currentIndex];
  const progress = ((currentIndex + 1) / players.length) * 100;
  const estimatedTime = Math.ceil((players.length - currentIndex) * 0.15);

  const submitCurrent = useCallback(() => {
    if (selectedSentiment !== null) {
      const rating: FanPlayerRating = {
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        sentiment: selectedSentiment,
        tags: selectedTags,
        comment: comment.trim() || undefined,
        timestamp: Date.now(),
        matchId,
      };
      setRatings(prev => [...prev, rating]);
    }
    advance();
  }, [selectedSentiment, selectedTags, comment, currentPlayer]);

  const advance = () => {
    setSelectedSentiment(null);
    setSelectedTags([]);
    setComment("");
    if (currentIndex + 1 >= players.length) {
      savePlayerRatings(matchId, [...ratings]);
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const posColor = {
    GK: "bg-amber-500/20 text-amber-600",
    DF: "bg-blue-500/20 text-blue-600",
    MF: "bg-emerald-500/20 text-emerald-600",
    FW: "bg-red-500/20 text-red-600",
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <h2 className="font-bold text-foreground">RATE THE PERFORMANCE</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{matchTitle}</p>
          <p className="text-xs text-muted-foreground">{matchSubtitle}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Player {currentIndex + 1} of {players.length}</span>
          <span>⏱️ ~{estimatedTime} min left</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Player Card */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayer.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-5 mt-2">
              {/* Player Info */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center text-2xl font-bold text-foreground">
                  {currentPlayer.number}
                </div>
                <h3 className="font-bold text-lg mt-2 text-foreground">{currentPlayer.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge variant="outline" className={posColor[currentPlayer.position]}>
                    {currentPlayer.position} • #{currentPlayer.number}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  How do you <span className="font-semibold text-foreground">FEEL</span> about his performance?
                </p>
              </div>

              {/* Sentiment Options */}
              <div className="space-y-2">
                {SENTIMENT_SCALE.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSentiment(idx)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      selectedSentiment === idx
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">"{option.description}"</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tags */}
              {selectedSentiment !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <p className="text-sm text-muted-foreground mb-2">What made you feel this way? (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {RATING_TAGS.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedTags.includes(tag.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-1">Add your voice:</p>
                    <Input
                      placeholder="Quick thought... (optional)"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      maxLength={140}
                    />
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={advance}>
          <SkipForward className="w-4 h-4 mr-1" />
          Skip Player
        </Button>
        <Button
          className="flex-1"
          disabled={selectedSentiment === null}
          onClick={submitCurrent}
        >
          Submit & Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
