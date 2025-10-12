import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIEmojiSuggestionsBar } from "./AIEmojiSuggestionsBar";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import { useAIPreMatchAnalysis } from "@/hooks/useAIPreMatchAnalysis";
import { Brain, Palette, Sparkles } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

interface EnhancedMatchExperienceProps {
  matchId: string;
  teamName?: string;
  context?: 'pre-match' | 'live' | 'post-match';
}

/**
 * Showcases all three AI enhancements working together:
 * 1. AI Pre-Match Intelligence
 * 2. Enhanced Emoji Intelligence
 * 3. Dynamic Themes
 */
export function EnhancedMatchExperience({ 
  matchId, 
  teamName,
  context = 'live' 
}: EnhancedMatchExperienceProps) {
  // Enable dynamic theme
  const { themeData, isActive } = useDynamicTheme({ matchId, enabled: true });
  
  // Fetch AI analysis
  const { data: analysis, isLoading } = useAIPreMatchAnalysis(matchId);

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feature Indicators */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-ai-green/10 border-primary/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Enhanced Match Experience
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-ai-green/10 text-ai-green">
              <Brain className="w-3 h-3 mr-1" />
              AI Intelligence
            </Badge>
            {isActive && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                <Palette className="w-3 h-3 mr-1" />
                Dynamic Theme
              </Badge>
            )}
          </div>
        </div>
        
        {isActive && themeData && (
          <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
            <p className="text-muted-foreground">
              🎨 Theme adapting to <strong>{themeData.intensity}</strong> match intensity
            </p>
          </div>
        )}
      </Card>

      {/* AI Emoji Intelligence */}
      <AIEmojiSuggestionsBar
        matchId={matchId}
        context={context}
        teamName={teamName}
        onEmojiSelect={(emoji, label) => {
          toast.success(`${emoji} ${label} - AI detected your vibe!`, {
            description: `Your reaction has been recorded`
          });
        }}
      />

      {/* AI Pre-Match Analysis Preview */}
      {analysis && (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-ai-green" />
            <span className="font-semibold text-sm">AI Match Intelligence</span>
            <Badge variant="outline" className="text-xs bg-ai-green/10 text-ai-green">
              Live Analysis
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{analysis.homeTeam}</span>
              <span className="font-semibold text-primary">
                {analysis.analysis.homeTeam.overallForm}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{analysis.awayTeam}</span>
              <span className="font-semibold text-accent">
                {analysis.analysis.awayTeam.overallForm}%
              </span>
            </div>
          </div>

          {analysis.analysis.matchPrediction && (
            <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded italic">
              {analysis.analysis.matchPrediction}
            </p>
          )}
        </Card>
      )}

      {/* Feature Explanation */}
      <Card className="p-3 bg-muted/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong>AI-Powered Features:</strong> This experience uses machine learning to analyze 
          match context, fan sentiment, and real-time data to provide intelligent emoji suggestions, 
          dynamic color themes that match match intensity, and deep tactical insights.
        </p>
      </Card>
    </div>
  );
}
