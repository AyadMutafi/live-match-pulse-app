import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  home_score: number;
  away_score: number;
  status: string;
  competition: string;
  home_team?: {
    name: string;
    league: string;
    country: string;
  };
  away_team?: {
    name: string;
    league: string;
    country: string;
  };
}

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name, league, country),
          away_team:teams!matches_away_team_id_fkey(name, league, country)
        `)
        .order("match_date", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Match[];
    },
  });
}

export function useFetchMatchesFromApi() {
  return async () => {
    const { data, error } = await supabase.functions.invoke("fetch-matches");
    
    if (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }
    
    return data;
  };
}
