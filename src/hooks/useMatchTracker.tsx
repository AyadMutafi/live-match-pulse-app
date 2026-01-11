import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMatches } from "./useMatches";

export interface MatchPlayer {
  name: string;
  position: string;
  shirtNumber: number;
}

export interface MatchGoal {
  minute: number;
  team: string;
  scorer: string;
  assist?: string;
  type?: string;
}

export interface MatchBooking {
  minute: number;
  team: string;
  player: string;
  card: string;
}

export interface MatchSubstitution {
  minute: number;
  team: string;
  playerOut: string;
  playerIn: string;
}

export interface MatchDetails {
  id: string;
  status: string;
  minute?: number;
  matchday?: number;
  competition: string;
  venue?: string;
  utcDate: string;
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
    winner?: string | null;
  };
  homeTeam: {
    name: string;
    shortName: string;
    formation?: string;
    lineup?: MatchPlayer[];
    bench?: MatchPlayer[];
    coach?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    formation?: string;
    lineup?: MatchPlayer[];
    bench?: MatchPlayer[];
    coach?: string;
  };
  goals?: MatchGoal[];
  bookings?: MatchBooking[];
  substitutions?: MatchSubstitution[];
  referees?: { name: string; nationality: string }[];
}

export interface TrackedMatch {
  matchId: string;
  apiMatchId?: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  status: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  details?: MatchDetails;
  lastUpdated: Date;
  isTracking: boolean;
}

// Determine refresh interval based on match status
function getRefreshInterval(status: string, minute?: number): number {
  const upperStatus = status?.toUpperCase() || "";
  
  // Live match
  if (["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF"].includes(upperStatus)) {
    // Final 10 minutes - more frequent updates
    if (minute && minute >= 80) {
      return 30 * 1000; // 30 seconds
    }
    return 60 * 1000; // 1 minute
  }
  
  // Half time
  if (["HALFTIME", "HT", "PAUSED"].includes(upperStatus)) {
    return 2 * 60 * 1000; // 2 minutes
  }
  
  // Extra time
  if (["EXTRA_TIME", "ET"].includes(upperStatus)) {
    return 20 * 1000; // 20 seconds
  }
  
  // Penalty shootout
  if (["PENALTY", "PEN"].includes(upperStatus)) {
    return 15 * 1000; // 15 seconds
  }
  
  // Scheduled - check less frequently
  if (["SCHEDULED", "TIMED"].includes(upperStatus)) {
    return 5 * 60 * 1000; // 5 minutes
  }
  
  // Finished or other
  return 10 * 60 * 1000; // 10 minutes
}

export function useMatchTracker() {
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const [trackedMatches, setTrackedMatches] = useState<Map<string, TrackedMatch>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Fetch detailed match data
  const fetchMatchDetails = useCallback(async (matchId: string, apiMatchId?: string): Promise<MatchDetails | null> => {
    try {
      console.log(`Fetching details for match ${matchId}`);
      const { data, error } = await supabase.functions.invoke('fetch-match-details', {
        body: { matchId, apiMatchId }
      });
      
      if (error) {
        console.error('Error fetching match details:', error);
        return null;
      }
      
      return data as MatchDetails;
    } catch (err) {
      console.error('Failed to fetch match details:', err);
      return null;
    }
  }, []);

  // Start tracking a specific match
  const startTracking = useCallback(async (matchId: string) => {
    const match = matches?.find(m => m.id === matchId);
    if (!match) return;

    // Initial fetch
    setIsRefreshing(true);
    const details = await fetchMatchDetails(matchId, match.api_match_id);
    setIsRefreshing(false);

    const trackedMatch: TrackedMatch = {
      matchId,
      apiMatchId: match.api_match_id,
      homeTeam: match.home_team?.name || 'Home',
      awayTeam: match.away_team?.name || 'Away',
      matchDate: match.match_date,
      status: match.status,
      homeScore: match.home_score || 0,
      awayScore: match.away_score || 0,
      competition: match.competition,
      details: details || undefined,
      lastUpdated: new Date(),
      isTracking: true,
    };

    setTrackedMatches(prev => new Map(prev).set(matchId, trackedMatch));

    // Set up auto-refresh interval
    const refreshInterval = getRefreshInterval(match.status, details?.minute);
    
    // Clear any existing interval
    const existingInterval = intervalRefs.current.get(matchId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const interval = setInterval(async () => {
      const updatedDetails = await fetchMatchDetails(matchId, match.api_match_id);
      if (updatedDetails) {
        setTrackedMatches(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(matchId);
          if (existing) {
            newMap.set(matchId, {
              ...existing,
              status: updatedDetails.status,
              homeScore: updatedDetails.score.fullTime.home || 0,
              awayScore: updatedDetails.score.fullTime.away || 0,
              details: updatedDetails,
              lastUpdated: new Date(),
            });
          }
          return newMap;
        });

        // Adjust interval based on new status
        const newInterval = getRefreshInterval(updatedDetails.status, updatedDetails.minute);
        if (newInterval !== refreshInterval) {
          clearInterval(intervalRefs.current.get(matchId)!);
          // Recursively start with new interval
          startTracking(matchId);
        }
      }
    }, refreshInterval);

    intervalRefs.current.set(matchId, interval);
  }, [matches, fetchMatchDetails]);

  // Stop tracking a specific match
  const stopTracking = useCallback((matchId: string) => {
    const interval = intervalRefs.current.get(matchId);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(matchId);
    }

    setTrackedMatches(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(matchId);
      if (existing) {
        newMap.set(matchId, { ...existing, isTracking: false });
      }
      return newMap;
    });
  }, []);

  // Manual refresh for a specific match
  const refreshMatch = useCallback(async (matchId: string) => {
    const tracked = trackedMatches.get(matchId);
    if (!tracked) return;

    setIsRefreshing(true);
    const details = await fetchMatchDetails(matchId, tracked.apiMatchId);
    setIsRefreshing(false);

    if (details) {
      setTrackedMatches(prev => {
        const newMap = new Map(prev);
        newMap.set(matchId, {
          ...tracked,
          status: details.status,
          homeScore: details.score.fullTime.home || 0,
          awayScore: details.score.fullTime.away || 0,
          details,
          lastUpdated: new Date(),
        });
        return newMap;
      });
    }
  }, [trackedMatches, fetchMatchDetails]);

  // Refresh all tracked matches
  const refreshAllMatches = useCallback(async () => {
    setIsRefreshing(true);
    const promises = Array.from(trackedMatches.keys()).map(matchId => refreshMatch(matchId));
    await Promise.all(promises);
    setIsRefreshing(false);
  }, [trackedMatches, refreshMatch]);

  // Auto-track live matches on mount
  useEffect(() => {
    if (matches) {
      const liveStatuses = ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED"];
      const liveMatches = matches.filter(m => liveStatuses.includes(m.status?.toUpperCase() || ""));
      
      liveMatches.forEach(match => {
        if (!trackedMatches.has(match.id)) {
          startTracking(match.id);
        }
      });
    }
  }, [matches]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval));
      intervalRefs.current.clear();
    };
  }, []);

  // Get list of tracked matches
  const trackedMatchesList = Array.from(trackedMatches.values());

  // Get live matches with full details
  const liveMatchesWithDetails = trackedMatchesList.filter(m => {
    const status = m.status?.toUpperCase() || "";
    return ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED", "EXTRA_TIME", "PENALTY"].includes(status);
  });

  return {
    // All matches from database
    allMatches: matches || [],
    matchesLoading,
    
    // Tracked matches with details
    trackedMatches: trackedMatchesList,
    liveMatchesWithDetails,
    
    // Actions
    startTracking,
    stopTracking,
    refreshMatch,
    refreshAllMatches,
    fetchMatchDetails,
    
    // State
    isRefreshing,
  };
}

export default useMatchTracker;
