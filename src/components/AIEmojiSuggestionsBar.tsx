import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { useAIEmojiSuggestions } from "@/hooks/useAIEmojiSuggestions";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface AIEmojiSuggestionsBarProps {
  matchId?: string;
  context?: 'pre-match' | 'live' | 'post-match';
  teamName?: string;
  currentScore?: { home: number; away: number };
  onEmojiSelect?: (emoji: string, label: string) => void;
}

export function AIEmojiSuggestionsBar({
  matchId,
  context = 'live',
  teamName,
  currentScore,
  onEmojiSelect
}: AIEmojiSuggestionsBarProps) {
  const { data: suggestions, isLoading } = useAIEmojiSuggestions({
    matchId,
    context,
    teamName,
    currentScore
  });

  if (isLoading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">AI Emoji Intelligence</span>
          <Sparkles className="w-3 h-3 text-accent animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="w-16 h-16 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">AI Emoji Intelligence</span>
          <Sparkles className="w-3 h-3 text-accent" />
        </div>
        <Badge variant="outline" className="text-xs bg-ai-green/10 text-ai-green border-ai-green/30">
          Context-Aware
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          AI suggests these reactions based on match context and fan sentiment:
        </p>
        
        <AnimatePresence mode="popLayout">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.emoji}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
              >
                <Button
                  variant="outline"
                  className="flex-shrink-0 flex flex-col items-center gap-1 h-auto p-3 bg-card hover:bg-primary/10 hover:border-primary/50 transition-all group relative overflow-hidden"
                  onClick={() => onEmojiSelect?.(suggestion.emoji, suggestion.label)}
                >
                  {/* Confidence indicator */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all group-hover:bg-primary/30"
                    style={{ height: `${suggestion.confidence * 100}%` }}
                  />
                  
                  <span className="text-2xl relative z-10 group-hover:scale-110 transition-transform">
                    {suggestion.emoji}
                  </span>
                  <span className="text-[10px] font-medium relative z-10 text-foreground">
                    {suggestion.label}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="text-[9px] px-1.5 py-0 h-4 relative z-10 bg-primary/10 text-primary"
                  >
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Show reason for top suggestion */}
        {suggestions[0] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-2 bg-muted/50 rounded-md"
          >
            <p className="text-xs text-muted-foreground italic">
              💡 <strong>{suggestions[0].label}:</strong> {suggestions[0].reason}
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
