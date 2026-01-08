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
  
  // Finished match - show if finished within the last 24 hours
  const finishedStatuses = ["FINISHED", "FT", "FULL_TIME"];
  if (finishedStatuses.includes(status)) {
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return matchDate >= twentyFourHoursAgo;
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
          home_team:teams!matches_home_team_id_fkey(name, league, country),
          away_team:teams!matches_away_team_id_fkey(name, league, country)
        `)
        .order("match_date", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Filter for allowed teams and relevant matches (live or finished within 30 min)
      const filteredData = (data as Match[])?.filter(match => {
        const isAllowed = isAllowedTeam(match.home_team?.name || "") || 
                          isAllowedTeam(match.away_team?.name || "");
        const isRelevant = isRelevantMatch(match);
        return isAllowed && isRelevant;
      });
      
      return filteredData;
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
