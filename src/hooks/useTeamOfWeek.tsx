import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamOfWeek(weekStart: string, weekEnd: string) {
  return useQuery({
    queryKey: ["team-of-week", weekStart, weekEnd],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-team-of-week', {
        body: { weekStart, weekEnd }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!(weekStart && weekEnd),
  });
}