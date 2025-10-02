import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMatchPrediction(matchId: string | null) {
  return useQuery({
    queryKey: ["match-prediction", matchId],
    queryFn: async () => {
      if (!matchId) return null;
      
      const { data, error } = await supabase.functions.invoke('predict-match', {
        body: { matchId }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}