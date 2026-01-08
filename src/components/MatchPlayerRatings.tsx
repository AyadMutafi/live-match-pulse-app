import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Users, Search, Filter, Star, TrendingUp, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerRatingCard } from "./PlayerRatingCard";
import { PlayerComparison } from "./PlayerComparison";
import { 
  PlayerRating, 
  generateMockPlayerRatings, 
  getRatingColor, 
  getRatingBgColor 
} from "@/lib/playerRatings";

interface TeamData {
  id: string;
  name: string;
  color: string;
}

interface MatchPlayerRatingsProps {
  homeTeam: TeamData;
  awayTeam: TeamData;
  matchId?: string;
}

type PositionFilter = "all" | "GK" | "DF" | "MF" | "FW";

export function MatchPlayerRatings({ homeTeam, awayTeam, matchId }: MatchPlayerRatingsProps) {
  const [activeTeam, setActiveTeam] = useState<"home" | "away">("home");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerRating[]>([]);

  // Generate mock ratings (in production, fetch from API)
  const homeRatings = useMemo(() => 
    generateMockPlayerRatings(homeTeam.name, homeTeam.id), 
    [homeTeam.name, homeTeam.id]
  );
  
  const awayRatings = useMemo(() => 
    generateMockPlayerRatings(awayTeam.name, awayTeam.id), 
    [awayTeam.name, awayTeam.id]
  );

  const currentRatings = activeTeam === "home" ? homeRatings : awayRatings;
  const currentTeam = activeTeam === "home" ? homeTeam : awayTeam;

  // Calculate team average
  const teamAverage = useMemo(() => {
    const ratings = currentRatings.map(p => p.rating);
    return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }, [currentRatings]);

  // Filter and search
  const filteredRatings = useMemo(() => {
    return currentRatings.filter(player => {
      const matchesPosition = positionFilter === "all" || player.position === positionFilter;
      const matchesSearch = searchQuery === "" || 
        player.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [currentRatings, positionFilter, searchQuery]);

  // Get top performer
  const topPerformer = useMemo(() => 
    [...currentRatings].sort((a, b) => b.rating - a.rating)[0],
    [currentRatings]
  );

  const handleCompare = (player: PlayerRating) => {
    if (selectedPlayers.length < 2) {
      if (!selectedPlayers.find(p => p.id === player.id)) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    }
    if (selectedPlayers.length === 1 && !selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const clearComparison = () => {
    setSelectedPlayers([]);
    setCompareMode(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Player Ratings</h3>
          <Badge variant="secondary" className="text-xs">
            Fan Sentiment Based
          </Badge>
        </div>
        <Button
          variant={compareMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCompareMode(!compareMode);
            if (compareMode) clearComparison();
          }}
        >
          {compareMode ? "Exit Compare" : "Compare Players"}
        </Button>
      </div>

      {/* Comparison View */}
      <AnimatePresence>
        {selectedPlayers.length === 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PlayerComparison 
              player1={selectedPlayers[0]} 
              player2={selectedPlayers[1]} 
              onClose={clearComparison}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Tabs */}
      <Tabs value={activeTeam} onValueChange={(v) => setActiveTeam(v as "home" | "away")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" className="gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: homeTeam.color }} 
            />
            {homeTeam.name}
          </TabsTrigger>
          <TabsTrigger value="away" className="gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: awayTeam.color }} 
            />
            {awayTeam.name}
          </TabsTrigger>
        </TabsList>

        {/* Team Average Rating Card */}
        <Card className="p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentTeam.color }}
              >
                {currentTeam.name.substring(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{currentTeam.name}</div>
                <div className="text-sm text-muted-foreground">Team Average Rating</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getRatingColor(teamAverage)}`}>
                {teamAverage.toFixed(1)}
              </div>
              <Progress value={teamAverage * 10} className="w-24 h-2 mt-1" />
            </div>
          </div>

          {/* Top Performer Highlight */}
          {topPerformer && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground">Top Performer:</span>
                <span className="font-semibold">{topPerformer.name}</span>
                <Badge variant="secondary" className={getRatingBgColor(topPerformer.rating)}>
                  {topPerformer.rating.toFixed(1)}
                </Badge>
              </div>
            </div>
          )}
        </Card>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={positionFilter} onValueChange={(v) => setPositionFilter(v as PositionFilter)}>
            <SelectTrigger className="w-[120px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="GK">Goalkeepers</SelectItem>
              <SelectItem value="DF">Defenders</SelectItem>
              <SelectItem value="MF">Midfielders</SelectItem>
              <SelectItem value="FW">Forwards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Player List */}
        <TabsContent value={activeTeam} className="mt-4">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredRatings.map((player) => (
                <PlayerRatingCard
                  key={player.id}
                  player={player}
                  onCompare={handleCompare}
                  compareMode={compareMode}
                  isSelected={selectedPlayers.some(p => p.id === player.id)}
                />
              ))}
            </AnimatePresence>
            
            {filteredRatings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No players found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
