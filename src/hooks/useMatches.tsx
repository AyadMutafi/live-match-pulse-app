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

// Check if a match is live or finished within 30 minutes
function isRelevantMatch(match: Match): boolean {
  const now = new Date();
  const matchDate = new Date(match.match_date);
  const status = match.status?.toUpperCase() || "";
  
  // Live match statuses
  const liveStatuses = ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED"];
  if (liveStatuses.includes(status)) {
    return true;
  }
  
  // Finished match - check if within 30 minutes of completion
  const finishedStatuses = ["FINISHED", "FT", "FULL_TIME"];
  if (finishedStatuses.includes(status)) {
    // Estimate match end time as match_date + ~2 hours (typical match duration)
    const estimatedEndTime = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
    const thirtyMinutesAfterEnd = new Date(estimatedEndTime.getTime() + 30 * 60 * 1000);
    return now <= thirtyMinutesAfterEnd;
  }
  
  // Scheduled/upcoming matches starting within next 2 hours (for pre-match monitoring)
  if (status === "SCHEDULED" || status === "TIMED" || status === "") {
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return matchDate >= now && matchDate <= twoHoursFromNow;
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
