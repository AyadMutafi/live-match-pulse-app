import { useMatchTracker, TrackedMatch, MatchPlayer } from "@/hooks/useMatchTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  Clock, 
  Users, 
  Target, 
  AlertTriangle, 
  ArrowRightLeft,
  Play,
  Pause,
  Trophy,
  MapPin
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { getTeamLogo } from "@/lib/teamLogos";

interface MatchTrackerProps {
  selectedMatchId?: string;
  onMatchSelect?: (matchId: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  const upperStatus = status?.toUpperCase() || "";
  
  if (["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF"].includes(upperStatus)) {
    return (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
        <Play className="w-3 h-3 mr-1" /> LIVE
      </Badge>
    );
  }
  
  if (["HALFTIME", "HT", "PAUSED"].includes(upperStatus)) {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <Pause className="w-3 h-3 mr-1" /> Half Time
      </Badge>
    );
  }
  
  if (["FINISHED", "FT", "FULL_TIME"].includes(upperStatus)) {
    return (
      <Badge className="bg-muted text-muted-foreground">
        <Trophy className="w-3 h-3 mr-1" /> Finished
      </Badge>
    );
  }
  
  if (["SCHEDULED", "TIMED"].includes(upperStatus)) {
    return (
      <Badge variant="outline">
        <Clock className="w-3 h-3 mr-1" /> Scheduled
      </Badge>
    );
  }
  
  return <Badge variant="outline">{status}</Badge>;
}

function LineupSection({ players, title, formation }: { players?: MatchPlayer[]; title: string; formation?: string }) {
  if (!players || players.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{title}</span>
        {formation && (
          <Badge variant="outline" className="text-xs">{formation}</Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {players.map((player, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs p-1.5 bg-muted/30 rounded">
            <span className="font-mono text-muted-foreground w-5">{player.shirtNumber}</span>
            <span className="truncate">{player.name}</span>
            <Badge variant="outline" className="text-[10px] ml-auto">{player.position}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchDetailsCard({ match, onRefresh, isRefreshing }: { 
  match: TrackedMatch; 
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const details = match.details;
  const homeLogo = getTeamLogo(match.homeTeam);
  const awayLogo = getTeamLogo(match.awayTeam);
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={match.status} />
            {details?.minute && (
              <Badge variant="secondary" className="font-mono">
                {details.minute}'
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(match.lastUpdated, { addSuffix: true })}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            {homeLogo ? (
              <img src={homeLogo} alt={match.homeTeam} className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                {match.homeTeam.charAt(0)}
              </div>
            )}
            <span className="font-medium text-sm text-center">{match.homeTeam}</span>
            {details?.homeTeam.coach && (
              <span className="text-xs text-muted-foreground">Coach: {details.homeTeam.coach}</span>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold">
              {match.homeScore} - {match.awayScore}
            </div>
            {details?.score.halfTime.home !== null && (
              <div className="text-xs text-muted-foreground mt-1">
                HT: {details.score.halfTime.home} - {details.score.halfTime.away}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2 flex-1">
            {awayLogo ? (
              <img src={awayLogo} alt={match.awayTeam} className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                {match.awayTeam.charAt(0)}
              </div>
            )}
            <span className="font-medium text-sm text-center">{match.awayTeam}</span>
            {details?.awayTeam.coach && (
              <span className="text-xs text-muted-foreground">Coach: {details.awayTeam.coach}</span>
            )}
          </div>
        </div>
        
        {/* Match Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {match.competition}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(match.matchDate), "PPp")}
          </div>
          {details?.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {details.venue}
            </div>
          )}
        </div>

        {/* Detailed Info Tabs */}
        {details && (
          <Tabs defaultValue="events" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
              <TabsTrigger value="home" className="text-xs">Home Squad</TabsTrigger>
              <TabsTrigger value="away" className="text-xs">Away Squad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="mt-3">
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {/* Goals */}
                  {details.goals?.map((goal, idx) => (
                    <div key={`goal-${idx}`} className="flex items-center gap-2 p-2 bg-green-500/10 rounded text-sm">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="font-mono text-muted-foreground">{goal.minute}'</span>
                      <span className="font-medium">{goal.scorer}</span>
                      {goal.assist && <span className="text-muted-foreground">(Assist: {goal.assist})</span>}
                      <Badge variant="outline" className="ml-auto text-xs">{goal.team}</Badge>
                    </div>
                  ))}
                  
                  {/* Bookings */}
                  {details.bookings?.map((booking, idx) => (
                    <div key={`booking-${idx}`} className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded text-sm">
                      <AlertTriangle className={`w-4 h-4 ${booking.card === 'RED' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <span className="font-mono text-muted-foreground">{booking.minute}'</span>
                      <span>{booking.player}</span>
                      <Badge variant={booking.card === 'RED' ? 'destructive' : 'secondary'} className="text-xs">
                        {booking.card}
                      </Badge>
                    </div>
                  ))}
                  
                  {/* Substitutions */}
                  {details.substitutions?.map((sub, idx) => (
                    <div key={`sub-${idx}`} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                      <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-muted-foreground">{sub.minute}'</span>
                      <span className="text-red-400">{sub.playerOut}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-400">{sub.playerIn}</span>
                    </div>
                  ))}
                  
                  {!details.goals?.length && !details.bookings?.length && !details.substitutions?.length && (
                    <div className="text-center text-muted-foreground py-8">
                      No events recorded yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="home" className="mt-3">
              <ScrollArea className="h-48">
                <div className="space-y-4">
                  <LineupSection 
                    players={details.homeTeam.lineup} 
                    title="Starting XI" 
                    formation={details.homeTeam.formation}
                  />
                  <LineupSection 
                    players={details.homeTeam.bench} 
                    title="Substitutes" 
                  />
                  {!details.homeTeam.lineup?.length && (
                    <div className="text-center text-muted-foreground py-8">
                      Lineup not available yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="away" className="mt-3">
              <ScrollArea className="h-48">
                <div className="space-y-4">
                  <LineupSection 
                    players={details.awayTeam.lineup} 
                    title="Starting XI" 
                    formation={details.awayTeam.formation}
                  />
                  <LineupSection 
                    players={details.awayTeam.bench} 
                    title="Substitutes" 
                  />
                  {!details.awayTeam.lineup?.length && (
                    <div className="text-center text-muted-foreground py-8">
                      Lineup not available yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export function MatchTracker({ selectedMatchId, onMatchSelect }: MatchTrackerProps) {
  const { 
    allMatches, 
    matchesLoading, 
    trackedMatches,
    startTracking,
    stopTracking,
    refreshMatch,
    isRefreshing
  } = useMatchTracker();

  // Find selected match in tracked matches
  const selectedTracked = selectedMatchId 
    ? trackedMatches.find(m => m.matchId === selectedMatchId)
    : trackedMatches[0];

  if (matchesLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading matches...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Match Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allMatches.slice(0, 10).map(match => {
              const isTracked = trackedMatches.some(t => t.matchId === match.id);
              const isSelected = selectedTracked?.matchId === match.id;
              
              return (
                <Button
                  key={match.id}
                  variant={isSelected ? "default" : isTracked ? "secondary" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (!isTracked) {
                      startTracking(match.id);
                    }
                    onMatchSelect?.(match.id);
                  }}
                >
                  {match.home_team?.name?.slice(0, 3).toUpperCase()} vs {match.away_team?.name?.slice(0, 3).toUpperCase()}
                  {isTracked && <span className="ml-1 w-2 h-2 rounded-full bg-green-500" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedTracked && (
        <MatchDetailsCard 
          match={selectedTracked}
          onRefresh={() => refreshMatch(selectedTracked.matchId)}
          isRefreshing={isRefreshing}
        />
      )}
      
      {!selectedTracked && trackedMatches.length === 0 && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Select a match above to start tracking</p>
            <p className="text-xs mt-1">Live matches will be tracked automatically</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MatchTracker;
