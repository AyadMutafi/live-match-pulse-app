import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface StandingRow {
  id: string;
  league_code: string;
  league_name: string;
  season: number;
  team_name: string;
  team_short_name: string | null;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form: string | null;
  updated_at: string;
}

export function useStandings(leagueCode?: string) {
  const queryClient = useQueryClient();

  // Fetch fresh standings on mount
  useEffect(() => {
    const fetchFresh = async () => {
      try {
        console.log("Fetching fresh standings from API...");
        const { error } = await supabase.functions.invoke("fetch-standings");
        if (error) {
          console.error("Error fetching standings:", error);
        } else {
          queryClient.invalidateQueries({ queryKey: ["standings"] });
        }
      } catch (err) {
        console.error("Failed to fetch standings:", err);
      }
    };
    fetchFresh();
  }, [queryClient]);

  return useQuery({
    queryKey: ["standings", leagueCode],
    queryFn: async () => {
      let query = supabase
        .from("league_standings")
        .select("*")
        .order("position", { ascending: true });

      if (leagueCode) {
        query = query.eq("league_code", leagueCode);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as StandingRow[]) || [];
    },
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
}
