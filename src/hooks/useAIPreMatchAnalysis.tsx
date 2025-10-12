import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamAnalysis {
  overallForm: number;
  tactics: {
    formation: string;
    style: string;
    effectiveness: number;
  };
  strengths: string[];
  weaknesses: string[];
  keyPlayers: Array<{
    name: string;
    position: string;
    formRating: number;
    keyStrengths: string[];
    concerns: string[];
  }>;
  expertOpinions: Array<{
    source: string;
    quote: string;
    sentiment: "positive" | "negative" | "neutral";
  }>;
}

interface AIPreMatchAnalysisData {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
  analysis: {
    homeTeam: TeamAnalysis;
    awayTeam: TeamAnalysis;
    matchPrediction?: string;
  };
}

export function useAIPreMatchAnalysis(matchId: string | null) {
  return useQuery({
    queryKey: ['ai-prematch-analysis', matchId],
    queryFn: async (): Promise<AIPreMatchAnalysisData | null> => {
      if (!matchId) return null;

      try {
        const { data, error } = await supabase.functions.invoke('generate-prematch-analysis', {
          body: { matchId }
        });

        if (error) {
          console.error('Error fetching AI pre-match analysis:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Failed to fetch AI pre-match analysis:', error);
        throw error;
      }
    },
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
