import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Zap, CheckCircle, Calendar } from "lucide-react";
import { format, parseISO, isAfter, isBefore, addHours, subHours } from "date-fns";
import { useMatches, Match } from "@/hooks/useMatches";
import { getTeamLogo } from "@/lib/teamLogos";

type MatchFilter = "all" | "live" | "upcoming" | "finished";

interface MatchCardProps {
  match: Match;
}

function getMatchStatus(match: Match): { 
  type: "live" | "finished" | "upcoming"; 
  display: string;
  minute?: number;
} {
  const status = match.status?.toUpperCase() || "";
  const matchDate = parseISO(match.match_date);
  const now = new Date();
  
  // Check for live statuses
  if (status === "IN_PLAY" || status === "LIVE" || status === "FIRST_HALF" || status === "SECOND_HALF") {
    // Calculate approximate minute based on match start time
    const minutesSinceStart = Math.floor((now.getTime() - matchDate.getTime()) / 60000);
    const minute = Math.min(Math.max(1, minutesSinceStart), 90);
    return { type: "live", display: `${minute}'`, minute };
  }
  
  if (status === "HALFTIME" || status === "HT") {
    return { type: "live", display: "HT", minute: 45 };
  }
  
  if (status === "PAUSED") {
    return { type: "live", display: "PAUSED" };
  }
  
  // Finished statuses
  if (status === "FINISHED" || status === "FT" || status === "FULL_TIME") {
    return { type: "finished", display: "FT" };
  }
  
  if (status === "POSTPONED") {
    return { type: "upcoming", display: "PPD" };
  }
  
  if (status === "CANCELLED") {
    return { type: "finished", display: "CANC" };
  }
  
  // Check if match should have started (scheduled but in the past by more than 2 hours = probably finished)
  if (isBefore(matchDate, subHours(now, 2))) {
    return { type: "finished", display: "FT" };
  }
  
  // Upcoming
  if (isAfter(matchDate, now) || status === "SCHEDULED" || status === "TIMED") {
    return { type: "upcoming", display: format(matchDate, "HH:mm") };
  }
  
  // Default to scheduled
  return { type: "upcoming", display: format(matchDate, "HH:mm") };
}

function MatchCard({ match }: MatchCardProps) {
  const { type, display, minute } = getMatchStatus(match);
  const homeLogo = getTeamLogo(match.home_team?.name || "");
  const awayLogo = getTeamLogo(match.away_team?.name || "");
  
  const getBadgeVariant = () => {
    switch (type) {
      case "live": return "destructive";
      case "finished": return "secondary";
      case "upcoming": return "outline";
    }
  };
  
  const getStatusIcon = () => {
    switch (type) {
      case "live": return <Zap className="w-3 h-3 mr-1" />;
      case "finished": return <CheckCircle className="w-3 h-3 mr-1" />;
      case "upcoming": return <Calendar className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <Card className="p-4 bg-card border-border hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <Badge variant={getBadgeVariant()} className="text-xs flex items-center">
          {getStatusIcon()}
          {type === "live" ? "LIVE" : type === "finished" ? "Finished" : "Upcoming"}
        </Badge>
        <div className="flex items-center text-xs font-medium">
          {type === "live" && <Clock className="w-3 h-3 mr-1 text-destructive animate-pulse" />}
          <span className={type === "live" ? "text-destructive font-bold" : "text-muted-foreground"}>
            {display}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {homeLogo ? (
              <img src={homeLogo} alt={match.home_team?.name} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {match.home_team?.name?.substring(0, 3).toUpperCase() || "HOM"}
              </div>
            )}
            <span className="font-medium text-sm">{match.home_team?.name || "Home"}</span>
          </div>
          <span className={`text-2xl font-bold ${type === "live" ? "text-destructive" : "text-primary"}`}>
            {type === "upcoming" ? "-" : match.home_score ?? 0}
          </span>
        </div>
        
        {/* Divider */}
        <div className="flex items-center justify-center">
          <div className="w-full h-px bg-border"></div>
          <span className="px-3 text-xs text-muted-foreground bg-card">VS</span>
          <div className="w-full h-px bg-border"></div>
        </div>
        
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {awayLogo ? (
              <img src={awayLogo} alt={match.away_team?.name} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {match.away_team?.name?.substring(0, 3).toUpperCase() || "AWY"}
              </div>
            )}
            <span className="font-medium text-sm">{match.away_team?.name || "Away"}</span>
          </div>
          <span className={`text-2xl font-bold ${type === "live" ? "text-destructive" : "text-primary"}`}>
            {type === "upcoming" ? "-" : match.away_score ?? 0}
          </span>
        </div>
      </div>
      
      {/* Competition */}
      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">{match.competition}</p>
      </div>
    </Card>
  );
}

export function MatchesSection() {
  const [filter, setFilter] = useState<MatchFilter>("all");
  const { data: matches, isLoading, error } = useMatches();
  
  const categorizedMatches = useMemo(() => {
    if (!matches) return { live: [], upcoming: [], finished: [] };
    
    const live: Match[] = [];
    const upcoming: Match[] = [];
    const finished: Match[] = [];
    
    matches.forEach((match) => {
      const { type } = getMatchStatus(match);
      switch (type) {
        case "live": live.push(match); break;
        case "upcoming": upcoming.push(match); break;
        case "finished": finished.push(match); break;
      }
    });
    
    // Sort upcoming by date ascending
    upcoming.sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
    // Sort finished by date descending (most recent first)
    finished.sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());
    
    return { live, upcoming, finished };
  }, [matches]);
  
  const filteredMatches = useMemo(() => {
    switch (filter) {
      case "live": return categorizedMatches.live;
      case "upcoming": return categorizedMatches.upcoming;
      case "finished": return categorizedMatches.finished;
      default: return [...categorizedMatches.live, ...categorizedMatches.upcoming, ...categorizedMatches.finished];
    }
  }, [filter, categorizedMatches]);
  
  const counts = {
    all: (matches?.length || 0),
    live: categorizedMatches.live.length,
    upcoming: categorizedMatches.upcoming.length,
    finished: categorizedMatches.finished.length,
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>Failed to load matches</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as MatchFilter)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs py-2 px-1">
            All
            <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="live" className="text-xs py-2 px-1">
            <Zap className="w-3 h-3 mr-1" />
            Live
            {counts.live > 0 && (
              <Badge variant="destructive" className="ml-1 text-[10px] h-4 px-1 animate-pulse">
                {counts.live}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs py-2 px-1">
            Upcoming
            <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">
              {counts.upcoming}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="finished" className="text-xs py-2 px-1">
            Finished
            <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">
              {counts.finished}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="font-medium">
            {filter === "live" && "No live matches right now"}
            {filter === "upcoming" && "No upcoming matches scheduled"}
            {filter === "finished" && "No finished matches to show"}
            {filter === "all" && "No matches found"}
          </p>
          <p className="text-sm mt-1">
            {filter === "live" && "Check back during match times"}
            {filter === "upcoming" && "New fixtures will appear soon"}
            {filter === "finished" && "Results will appear after matches"}
          </p>
        </div>
      )}
    </div>
  );
}
