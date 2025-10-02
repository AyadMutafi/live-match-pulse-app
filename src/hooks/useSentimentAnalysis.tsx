import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSentimentAnalysis(matchId: string | null) {
  return useQuery({
    queryKey: ["sentiment-analysis", matchId],
    queryFn: async () => {
      if (!matchId) return null;
      
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { matchId }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}