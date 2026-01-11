import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isAllowedTeam } from "@/lib/constants";
import { useEffect } from "react";

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  home_score: number;
  away_score: number;
  status: string;
  competition: string;
  api_match_id?: string;
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

// Check if a match is live, recently finished (last 24 hours), or upcoming
function isRelevantMatch(match: Match): boolean {
  const now = new Date();
  const matchDate = new Date(match.match_date);
  const status = match.status?.toUpperCase() || "";
  
  // Live match statuses
  const liveStatuses = ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED"];
  if (liveStatuses.includes(status)) {
    return true;
  }
  
  // Finished match - show if started within the last 48 hours (covers "yesterday" even late today)
  const finishedStatuses = ["FINISHED", "FT", "FULL_TIME"];
  if (finishedStatuses.includes(status)) {
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    return matchDate >= fortyEightHoursAgo;
  }
  
  // Scheduled/upcoming matches - show all upcoming matches within next 7 days
  if (status === "SCHEDULED" || status === "TIMED" || status === "") {
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return matchDate >= now && matchDate <= sevenDaysFromNow;
  }
  
  return false;
}

export function useMatches() {
  const queryClient = useQueryClient();
  
  // Fetch fresh match data on mount
  useEffect(() => {
    const fetchFreshMatches = async () => {
      try {
        console.log("Fetching fresh matches from API...");
        const { error } = await supabase.functions.invoke("fetch-matches");
        if (error) {
          console.error("Error fetching fresh matches:", error);
        } else {
          // Invalidate query to refetch from database
          queryClient.invalidateQueries({ queryKey: ["matches"] });
        }
      } catch (err) {
        console.error("Failed to fetch fresh matches:", err);
      }
    };
    
    fetchFreshMatches();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchFreshMatches, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [queryClient]);
  
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          api_match_id,
          home_team:teams!matches_home_team_id_fkey(name, league, country),
          away_team:teams!matches_away_team_id_fkey(name, league, country)
        `)
        .order("match_date", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Filter by time relevance first; then prefer "allowed teams" if any exist.
      const relevantMatches = (data as Match[])?.filter(isRelevantMatch) ?? [];

      const allowedRelevant = relevantMatches.filter(match => {
        return (
          isAllowedTeam(match.home_team?.name || "") ||
          isAllowedTeam(match.away_team?.name || "")
        );
      });

      // If the allowed-teams filter would hide everything, fall back to showing relevant matches.
      return allowedRelevant.length > 0 ? allowedRelevant : relevantMatches;
    },
    refetchInterval: 60 * 1000, // Refetch every minute for live updates
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

// Hook to get only live matches for sentiment monitoring
export function useLiveMatches() {
  const { data: matches, ...rest } = useMatches();
  
  const liveMatches = matches?.filter(match => {
    const status = match.status?.toUpperCase() || "";
    return ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED"].includes(status);
  });
  
  return { data: liveMatches, ...rest };
}
