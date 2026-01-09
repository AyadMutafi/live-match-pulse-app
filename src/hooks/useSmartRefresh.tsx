import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLiveMatches, Match } from "./useMatches";

interface RefreshState {
  interval: number;
  reason: string;
  isBoost: boolean;
  boostEndTime: number | null;
}

interface MatchEvent {
  type: "goal" | "red_card" | "penalty" | "final_minutes" | "extra_time";
  matchId: string;
  timestamp: number;
}

// Refresh intervals in milliseconds
const REFRESH_INTERVALS = {
  NO_LIVE_MATCHES: 5 * 60 * 1000,     // 5 minutes
  LIVE_MATCH: 60 * 1000,               // 60 seconds
  GOAL: 10 * 1000,                     // 10 seconds for 2 min
  RED_CARD: 15 * 1000,                 // 15 seconds for 1 min
  PENALTY: 15 * 1000,                  // 15 seconds for 1 min
  FINAL_10_MINUTES: 30 * 1000,         // 30 seconds
  EXTRA_TIME: 20 * 1000,               // 20 seconds
};

// Duration of boost periods in milliseconds
const BOOST_DURATIONS = {
  goal: 2 * 60 * 1000,                 // 2 minutes after goal
  red_card: 60 * 1000,                 // 1 minute after red card
  penalty: 60 * 1000,                  // 1 minute after penalty
};

export function useSmartRefresh() {
  const queryClient = useQueryClient();
  const { data: liveMatches } = useLiveMatches();
  const [refreshState, setRefreshState] = useState<RefreshState>({
    interval: REFRESH_INTERVALS.NO_LIVE_MATCHES,
    reason: "No live matches",
    isBoost: false,
    boostEndTime: null,
  });
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [events, setEvents] = useState<MatchEvent[]>([]);
  
  // Store previous scores to detect goals
  const previousScores = useRef<Map<string, { home: number; away: number }>>(new Map());
  
  // Detect match events (goals, etc.) by comparing scores
  const detectEvents = useCallback((matches: Match[] | undefined) => {
    if (!matches) return;
    
    const now = Date.now();
    const newEvents: MatchEvent[] = [];
    
    matches.forEach(match => {
      const prevScore = previousScores.current.get(match.id);
      const currentHome = match.home_score ?? 0;
      const currentAway = match.away_score ?? 0;
      
      if (prevScore) {
        // Detect goal
        if (currentHome > prevScore.home || currentAway > prevScore.away) {
          newEvents.push({
            type: "goal",
            matchId: match.id,
            timestamp: now,
          });
        }
      }
      
      // Update previous scores
      previousScores.current.set(match.id, { home: currentHome, away: currentAway });
    });
    
    if (newEvents.length > 0) {
      setEvents(prev => [...prev, ...newEvents]);
    }
  }, []);
  
  // Check if any match is in special state
  const getMatchState = useCallback((matches: Match[] | undefined): { 
    hasLiveMatches: boolean;
    inFinalMinutes: boolean;
    inExtraTime: boolean;
  } => {
    if (!matches || matches.length === 0) {
      return { hasLiveMatches: false, inFinalMinutes: false, inExtraTime: false };
    }
    
    let inFinalMinutes = false;
    let inExtraTime = false;
    
    matches.forEach(match => {
      const status = match.status?.toUpperCase() || "";
      const matchDate = new Date(match.match_date);
      const now = new Date();
      const minutesSinceStart = Math.floor((now.getTime() - matchDate.getTime()) / 60000);
      
      // Check for final 10 minutes (80-90 min)
      if (minutesSinceStart >= 80 && minutesSinceStart <= 90) {
        inFinalMinutes = true;
      }
      
      // Check for extra time
      if (minutesSinceStart > 90 || status.includes("EXTRA") || status.includes("ET")) {
        inExtraTime = true;
      }
    });
    
    return { hasLiveMatches: true, inFinalMinutes, inExtraTime };
  }, []);
  
  // Calculate current refresh interval
  const calculateRefreshInterval = useCallback((): RefreshState => {
    const now = Date.now();
    const matchState = getMatchState(liveMatches);
    
    // Check for active boost events (goal, red card, penalty)
    const activeBoostEvent = events.find(event => {
      const boostDuration = BOOST_DURATIONS[event.type as keyof typeof BOOST_DURATIONS];
      if (!boostDuration) return false;
      return now - event.timestamp < boostDuration;
    });
    
    if (activeBoostEvent) {
      const boostDuration = BOOST_DURATIONS[activeBoostEvent.type as keyof typeof BOOST_DURATIONS];
      const boostEndTime = activeBoostEvent.timestamp + boostDuration;
      const remainingSeconds = Math.ceil((boostEndTime - now) / 1000);
      
      let interval = REFRESH_INTERVALS.GOAL;
      let reason = `Goal scored! Boosted refresh (${remainingSeconds}s remaining)`;
      
      if (activeBoostEvent.type === "red_card") {
        interval = REFRESH_INTERVALS.RED_CARD;
        reason = `Red card! Boosted refresh (${remainingSeconds}s remaining)`;
      } else if (activeBoostEvent.type === "penalty") {
        interval = REFRESH_INTERVALS.PENALTY;
        reason = `Penalty! Boosted refresh (${remainingSeconds}s remaining)`;
      }
      
      return { interval, reason, isBoost: true, boostEndTime };
    }
    
    // Clean up expired events
    setEvents(prev => prev.filter(e => {
      const boostDuration = BOOST_DURATIONS[e.type as keyof typeof BOOST_DURATIONS] || 0;
      return now - e.timestamp < boostDuration;
    }));
    
    // No live matches
    if (!matchState.hasLiveMatches) {
      return {
        interval: REFRESH_INTERVALS.NO_LIVE_MATCHES,
        reason: "No live matches - checking every 5 min",
        isBoost: false,
        boostEndTime: null,
      };
    }
    
    // Extra time
    if (matchState.inExtraTime) {
      return {
        interval: REFRESH_INTERVALS.EXTRA_TIME,
        reason: "Extra time - refreshing every 20s",
        isBoost: false,
        boostEndTime: null,
      };
    }
    
    // Final 10 minutes
    if (matchState.inFinalMinutes) {
      return {
        interval: REFRESH_INTERVALS.FINAL_10_MINUTES,
        reason: "Final 10 minutes - refreshing every 30s",
        isBoost: false,
        boostEndTime: null,
      };
    }
    
    // Normal live match
    return {
      interval: REFRESH_INTERVALS.LIVE_MATCH,
      reason: "Live match - refreshing every 60s",
      isBoost: false,
      boostEndTime: null,
    };
  }, [liveMatches, events, getMatchState]);
  
  // Trigger event manually (for testing or external triggers)
  const triggerEvent = useCallback((type: MatchEvent["type"], matchId: string = "manual") => {
    setEvents(prev => [...prev, { type, matchId, timestamp: Date.now() }]);
  }, []);
  
  // Perform refresh
  const performRefresh = useCallback(async () => {
    // Detect any new events from score changes
    detectEvents(liveMatches);
    
    // Invalidate all relevant queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["matches"] }),
      queryClient.invalidateQueries({ queryKey: ["match-pulse"] }),
      queryClient.invalidateQueries({ queryKey: ["social-posts"] }),
      queryClient.invalidateQueries({ queryKey: ["fan-reactions"] }),
      queryClient.invalidateQueries({ queryKey: ["player-ratings"] }),
      queryClient.invalidateQueries({ queryKey: ["sentiment"] }),
    ]);
    
    setLastRefresh(new Date());
  }, [queryClient, detectEvents, liveMatches]);
  
  // Main refresh loop
  useEffect(() => {
    const newState = calculateRefreshInterval();
    setRefreshState(newState);
    
    const intervalId = setInterval(() => {
      performRefresh();
      const updatedState = calculateRefreshInterval();
      setRefreshState(updatedState);
    }, newState.interval);
    
    return () => clearInterval(intervalId);
  }, [calculateRefreshInterval, performRefresh]);
  
  // Update state when events change
  useEffect(() => {
    const newState = calculateRefreshInterval();
    setRefreshState(newState);
  }, [events, calculateRefreshInterval]);
  
  return {
    refreshState,
    lastRefresh,
    triggerEvent,
    performRefresh,
    liveMatchCount: liveMatches?.length || 0,
  };
}
