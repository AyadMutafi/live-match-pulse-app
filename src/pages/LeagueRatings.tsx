import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, TrendingUp, TrendingDown, Users, 
  Search, ArrowLeft, Share2, Calendar, Medal, 
  Flame, Sparkles, ChevronDown, ChevronUp, TableIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { PlayerRatingCard } from "@/components/PlayerRatingCard";
import { PlayerComparison } from "@/components/PlayerComparison";
import { LeagueStandings } from "@/components/LeagueStandings";
import { 
  PlayerRating, 
  generateMockPlayerRatings, 
  getRatingBadge, 
  getRatingColor, 
  getRatingBgColor,
  getTrendIndicator
} from "@/lib/playerRatings";

const LEAGUES = [
  { id: "premier-league", name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "la-liga", name: "La Liga", country: "Spain", flag: "🇪🇸" },
  { id: "serie-a", name: "Serie A", country: "Italy", flag: "🇮🇹" },
  { id: "bundesliga", name: "Bundesliga", country: "Germany", flag: "🇩🇪" },
  { id: "ligue-1", name: "Ligue 1", country: "France", flag: "🇫🇷" },
  { id: "champions-league", name: "Champions League", country: "Europe", flag: "🇪🇺" },
];

const TEAMS_BY_LEAGUE: Record<string, { id: string; name: string; color: string }[]> = {
  "premier-league": [
    { id: "mci", name: "Manchester City", color: "#6CABDD" },
    { id: "ars", name: "Arsenal", color: "#EF0107" },
    { id: "liv", name: "Liverpool", color: "#C8102E" },
    { id: "mun", name: "Manchester United", color: "#DA291C" },
    { id: "che", name: "Chelsea", color: "#034694" },
    { id: "tot", name: "Tottenham", color: "#132257" },
  ],
  "la-liga": [
    { id: "rma", name: "Real Madrid", color: "#FEBE10" },
    { id: "fcb", name: "FC Barcelona", color: "#A50044" },
    { id: "atm", name: "Atlético Madrid", color: "#CB3524" },
    { id: "sev", name: "Sevilla", color: "#F43333" },
    { id: "val", name: "Valencia", color: "#EE8707" },
    { id: "rsb", name: "Real Sociedad", color: "#143C8B" },
  ],
  "serie-a": [
    { id: "int", name: "Inter Milan", color: "#0068A8" },
    { id: "acm", name: "AC Milan", color: "#FB090B" },
    { id: "juv", name: "Juventus", color: "#000000" },
    { id: "nap", name: "Napoli", color: "#12A0D7" },
    { id: "rom", name: "AS Roma", color: "#8E1F2F" },
    { id: "ata", name: "Atalanta", color: "#1E71B8" },
  ],
  "bundesliga": [
    { id: "bay", name: "Bayern Munich", color: "#DC052D" },
    { id: "bvb", name: "Borussia Dortmund", color: "#FDE100" },
    { id: "rbl", name: "RB Leipzig", color: "#DD0741" },
    { id: "lev", name: "Bayer Leverkusen", color: "#E32221" },
    { id: "bmg", name: "Borussia Mönchengladbach", color: "#000000" },
    { id: "fra", name: "Eintracht Frankfurt", color: "#E1000F" },
  ],
  "ligue-1": [
    { id: "psg", name: "Paris Saint-Germain", color: "#004170" },
    { id: "mar", name: "Marseille", color: "#2FAEE0" },
    { id: "mon", name: "Monaco", color: "#E62433" },
    { id: "lil", name: "Lille", color: "#E12C1E" },
    { id: "oly", name: "Lyon", color: "#0A3F87" },
    { id: "nic", name: "Nice", color: "#000000" },
  ],
  "champions-league": [
    { id: "rma", name: "Real Madrid", color: "#FEBE10" },
    { id: "mci", name: "Manchester City", color: "#6CABDD" },
    { id: "bay", name: "Bayern Munich", color: "#DC052D" },
    { id: "fcb", name: "FC Barcelona", color: "#A50044" },
    { id: "psg", name: "Paris Saint-Germain", color: "#004170" },
    { id: "int", name: "Inter Milan", color: "#0068A8" },
  ],
};

function generateLeaguePlayerData(leagueId: string): PlayerRating[] {
  const teams = TEAMS_BY_LEAGUE[leagueId] || TEAMS_BY_LEAGUE["premier-league"];
  const allPlayers: PlayerRating[] = [];
  
  teams.forEach(team => {
    const teamPlayers = generateMockPlayerRatings(team.name, team.id);
    allPlayers.push(...teamPlayers);
  });
  
  return allPlayers.sort((a, b) => b.rating - a.rating);
}

function getBestXI(players: PlayerRating[]): PlayerRating[] {
  // Get best player for each position in 4-3-3 formation
  const positions: Record<string, number> = { GK: 1, DF: 4, MF: 3, FW: 3 };
  const bestXI: PlayerRating[] = [];
  
  Object.entries(positions).forEach(([pos, count]) => {
    const positionPlayers = players
      .filter(p => p.position === pos)
      .slice(0, count);
    bestXI.push(...positionPlayers);
  });
  
  return bestXI;
}

export default function LeagueRatings() {
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState("premier-league");
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("standings");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerRating[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>("top-10");

  const allPlayers = useMemo(() => 
    generateLeaguePlayerData(selectedLeague), 
    [selectedLeague]
  );

  const bestXI = useMemo(() => getBestXI(allPlayers), [allPlayers]);
  const topPerformers = useMemo(() => allPlayers.slice(0, 10), [allPlayers]);
  const worstPerformers = useMemo(() => 
    [...allPlayers].sort((a, b) => a.rating - b.rating).slice(0, 5), 
    [allPlayers]
  );
  const mostImproved = useMemo(() => 
    [...allPlayers]
      .filter(p => p.previousRating !== undefined)
      .sort((a, b) => (b.rating - (b.previousRating || b.rating)) - (a.rating - (a.previousRating || a.rating)))
      .slice(0, 5),
    [allPlayers]
  );

  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return [];
    return allPlayers.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPlayers, searchQuery]);

  const currentLeague = LEAGUES.find(l => l.id === selectedLeague);

  const handleCompare = (player: PlayerRating) => {
    if (selectedPlayers.length < 2 && !selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const clearComparison = () => {
    setSelectedPlayers([]);
    setCompareMode(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container px-4 py-6 pb-24">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              League Ratings
            </h1>
            <p className="text-sm text-muted-foreground">
              Weekly player ratings based on fan sentiment analysis
            </p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAGUES.map(league => (
                <SelectItem key={league.id} value={league.id}>
                  <span className="flex items-center gap-2">
                    <span>{league.flag}</span>
                    <span>{league.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">This Week</SelectItem>
              <SelectItem value="week-1">Week 1</SelectItem>
              <SelectItem value="week-2">Week 2</SelectItem>
              <SelectItem value="week-3">Week 3</SelectItem>
              <SelectItem value="week-4">Week 4</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) clearComparison();
            }}
          >
            {compareMode ? "Exit Compare" : "Compare"}
          </Button>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchQuery && filteredPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Results ({filteredPlayers.length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredPlayers.slice(0, 10).map(player => (
                    <PlayerRatingCard
                      key={player.id}
                      player={player}
                      onCompare={handleCompare}
                      compareMode={compareMode}
                      isSelected={selectedPlayers.some(p => p.id === player.id)}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison View */}
        <AnimatePresence>
          {selectedPlayers.length === 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <PlayerComparison 
                player1={selectedPlayers[0]} 
                player2={selectedPlayers[1]} 
                onClose={clearComparison}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="standings" className="gap-1">
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Standings</span>
            </TabsTrigger>
            <TabsTrigger value="best-xi" className="gap-1">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Best XI</span>
            </TabsTrigger>
            <TabsTrigger value="top-performers" className="gap-1">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Top 10</span>
            </TabsTrigger>
            <TabsTrigger value="worst" className="gap-1">
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Worst 5</span>
            </TabsTrigger>
            <TabsTrigger value="improved" className="gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Improved</span>
            </TabsTrigger>
          </TabsList>

          {/* Standings Tab */}
          <TabsContent value="standings">
            <LeagueStandings 
              leagueId={selectedLeague}
              leagueName={currentLeague?.name || "Premier League"}
              leagueFlag={currentLeague?.flag || "🏴󠁧󠁢󠁥󠁮󠁧󠁿"}
            />
          </TabsContent>

          {/* Best XI Tab */}
          <TabsContent value="best-xi">
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  {currentLeague?.flag} Best XI of the Week
                </h3>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Formation Visual */}
              <div className="relative bg-gradient-to-b from-green-600 to-green-700 rounded-lg p-4 mb-6 min-h-[300px]">
                {/* Field markings */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/30" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full" />
                
                {/* Players positioned in 4-3-3 */}
                <div className="relative h-full grid grid-rows-4 gap-2 py-4">
                  {/* Forwards */}
                  <div className="flex justify-around items-center">
                    {bestXI.filter(p => p.position === "FW").map(player => (
                      <PlayerBadge key={player.id} player={player} />
                    ))}
                  </div>
                  {/* Midfielders */}
                  <div className="flex justify-around items-center">
                    {bestXI.filter(p => p.position === "MF").map(player => (
                      <PlayerBadge key={player.id} player={player} />
                    ))}
                  </div>
                  {/* Defenders */}
                  <div className="flex justify-around items-center">
                    {bestXI.filter(p => p.position === "DF").map(player => (
                      <PlayerBadge key={player.id} player={player} />
                    ))}
                  </div>
                  {/* Goalkeeper */}
                  <div className="flex justify-center items-center">
                    {bestXI.filter(p => p.position === "GK").map(player => (
                      <PlayerBadge key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Best XI List */}
              <div className="space-y-2">
                {bestXI.map((player, index) => (
                  <PlayerRatingCard
                    key={player.id}
                    player={player}
                    onCompare={handleCompare}
                    compareMode={compareMode}
                    isSelected={selectedPlayers.some(p => p.id === player.id)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Top Performers Tab */}
          <TabsContent value="top-performers">
            <Card className="p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                Top 10 Performers
              </h3>
              <div className="space-y-2">
                {topPerformers.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-yellow-500 text-white" :
                      index === 1 ? "bg-gray-400 text-white" :
                      index === 2 ? "bg-amber-600 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <PlayerRatingCard
                        player={player}
                        onCompare={handleCompare}
                        compareMode={compareMode}
                        isSelected={selectedPlayers.some(p => p.id === player.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Worst Performers Tab */}
          <TabsContent value="worst">
            <Card className="p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Worst Performers (Bottom 5)
              </h3>
              <div className="space-y-2">
                {worstPerformers.map((player) => (
                  <PlayerRatingCard
                    key={player.id}
                    player={player}
                    onCompare={handleCompare}
                    compareMode={compareMode}
                    isSelected={selectedPlayers.some(p => p.id === player.id)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Most Improved Tab */}
          <TabsContent value="improved">
            <Card className="p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Most Improved Players
              </h3>
              <div className="space-y-2">
                {mostImproved.map((player) => {
                  const improvement = player.rating - (player.previousRating || player.rating);
                  return (
                    <div key={player.id} className="relative">
                      <Badge 
                        className="absolute -top-1 -right-1 z-10 bg-green-500"
                      >
                        +{improvement.toFixed(1)}
                      </Badge>
                      <PlayerRatingCard
                        player={player}
                        onCompare={handleCompare}
                        compareMode={compareMode}
                        isSelected={selectedPlayers.some(p => p.id === player.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Small player badge for formation view
function PlayerBadge({ player }: { player: PlayerRating }) {
  const badge = getRatingBadge(player.rating);
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${getRatingBgColor(player.rating)} border-2 border-white`}>
        {player.rating.toFixed(1)}
      </div>
      <div className="mt-1 text-[10px] text-white font-medium text-center max-w-[60px] truncate bg-black/50 px-1 rounded">
        {player.name.split(" ").pop()}
      </div>
      <div className="text-[8px] text-white/80 bg-black/30 px-1 rounded">
        {player.teamName.substring(0, 3).toUpperCase()}
      </div>
    </div>
  );
}
