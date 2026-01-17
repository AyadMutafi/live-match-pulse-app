import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Trophy, Medal, ChevronUp, ChevronDown, Minus,
  TrendingUp, TrendingDown, ArrowUpDown
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeamStanding {
  position: number;
  team: {
    id: string;
    name: string;
    shortName: string;
    color: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ("W" | "D" | "L")[];
  sentiment: {
    score: number;
    trend: "up" | "down" | "stable";
    emoji: string;
  };
}

interface LeagueStandingsProps {
  leagueId: string;
  leagueName: string;
  leagueFlag: string;
}

type SortKey = "position" | "team" | "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst" | "goalDifference" | "points" | "sentiment";
type SortDirection = "asc" | "desc";

// Generate mock standings data
function generateStandings(leagueId: string): TeamStanding[] {
  const teamsData: Record<string, { id: string; name: string; shortName: string; color: string }[]> = {
    "premier-league": [
      { id: "mci", name: "Manchester City", shortName: "MCI", color: "#6CABDD" },
      { id: "ars", name: "Arsenal", shortName: "ARS", color: "#EF0107" },
      { id: "liv", name: "Liverpool", shortName: "LIV", color: "#C8102E" },
      { id: "avl", name: "Aston Villa", shortName: "AVL", color: "#670E36" },
      { id: "tot", name: "Tottenham", shortName: "TOT", color: "#132257" },
      { id: "che", name: "Chelsea", shortName: "CHE", color: "#034694" },
      { id: "new", name: "Newcastle United", shortName: "NEW", color: "#241F20" },
      { id: "mun", name: "Manchester United", shortName: "MUN", color: "#DA291C" },
      { id: "whu", name: "West Ham United", shortName: "WHU", color: "#7A263A" },
      { id: "cry", name: "Crystal Palace", shortName: "CRY", color: "#1B458F" },
      { id: "bha", name: "Brighton", shortName: "BHA", color: "#0057B8" },
      { id: "wol", name: "Wolves", shortName: "WOL", color: "#FDB913" },
      { id: "bou", name: "Bournemouth", shortName: "BOU", color: "#DA291C" },
      { id: "ful", name: "Fulham", shortName: "FUL", color: "#000000" },
      { id: "bre", name: "Brentford", shortName: "BRE", color: "#E30613" },
      { id: "eve", name: "Everton", shortName: "EVE", color: "#003399" },
      { id: "nfo", name: "Nottingham Forest", shortName: "NFO", color: "#DD0000" },
      { id: "lut", name: "Luton Town", shortName: "LUT", color: "#F78F1E" },
      { id: "bur", name: "Burnley", shortName: "BUR", color: "#6C1D45" },
      { id: "shu", name: "Sheffield United", shortName: "SHU", color: "#EE2737" },
    ],
    "la-liga": [
      { id: "rma", name: "Real Madrid", shortName: "RMA", color: "#FEBE10" },
      { id: "fcb", name: "FC Barcelona", shortName: "BAR", color: "#A50044" },
      { id: "gir", name: "Girona", shortName: "GIR", color: "#CD2534" },
      { id: "atm", name: "Atlético Madrid", shortName: "ATM", color: "#CB3524" },
      { id: "ath", name: "Athletic Bilbao", shortName: "ATH", color: "#EE2523" },
      { id: "bet", name: "Real Betis", shortName: "BET", color: "#00954C" },
      { id: "rsb", name: "Real Sociedad", shortName: "RSO", color: "#143C8B" },
      { id: "val", name: "Valencia", shortName: "VAL", color: "#EE8707" },
      { id: "vil", name: "Villarreal", shortName: "VIL", color: "#FFE114" },
      { id: "sev", name: "Sevilla", shortName: "SEV", color: "#F43333" },
      { id: "get", name: "Getafe", shortName: "GET", color: "#004FA3" },
      { id: "osa", name: "Osasuna", shortName: "OSA", color: "#D91A21" },
      { id: "cel", name: "Celta Vigo", shortName: "CEL", color: "#8AC3EE" },
      { id: "mal", name: "Mallorca", shortName: "MLL", color: "#E20613" },
      { id: "ray", name: "Rayo Vallecano", shortName: "RAY", color: "#E53027" },
      { id: "las", name: "Las Palmas", shortName: "LPA", color: "#FFE400" },
      { id: "ala", name: "Alavés", shortName: "ALA", color: "#0060A9" },
      { id: "cad", name: "Cádiz", shortName: "CAD", color: "#FDE607" },
      { id: "gra", name: "Granada", shortName: "GRA", color: "#C8102E" },
      { id: "alm", name: "Almería", shortName: "ALM", color: "#EE1C25" },
    ],
    "serie-a": [
      { id: "int", name: "Inter Milan", shortName: "INT", color: "#0068A8" },
      { id: "juv", name: "Juventus", shortName: "JUV", color: "#000000" },
      { id: "acm", name: "AC Milan", shortName: "MIL", color: "#FB090B" },
      { id: "ata", name: "Atalanta", shortName: "ATA", color: "#1E71B8" },
      { id: "bol", name: "Bologna", shortName: "BOL", color: "#1A2F48" },
      { id: "rom", name: "AS Roma", shortName: "ROM", color: "#8E1F2F" },
      { id: "laz", name: "Lazio", shortName: "LAZ", color: "#89D0F0" },
      { id: "fio", name: "Fiorentina", shortName: "FIO", color: "#6B4694" },
      { id: "nap", name: "Napoli", shortName: "NAP", color: "#12A0D7" },
      { id: "tor", name: "Torino", shortName: "TOR", color: "#8B1538" },
      { id: "mon", name: "Monza", shortName: "MON", color: "#C8102E" },
      { id: "gen", name: "Genoa", shortName: "GEN", color: "#9E1B32" },
      { id: "lec", name: "Lecce", shortName: "LEC", color: "#FFCC00" },
      { id: "udl", name: "Udinese", shortName: "UDI", color: "#000000" },
      { id: "cag", name: "Cagliari", shortName: "CAG", color: "#003366" },
      { id: "emp", name: "Empoli", shortName: "EMP", color: "#005BA6" },
      { id: "ver", name: "Hellas Verona", shortName: "VER", color: "#1A2F5A" },
      { id: "fro", name: "Frosinone", shortName: "FRO", color: "#FFDD00" },
      { id: "sas", name: "Sassuolo", shortName: "SAS", color: "#00A651" },
      { id: "sal", name: "Salernitana", shortName: "SAL", color: "#8B0000" },
    ],
    "bundesliga": [
      { id: "lev", name: "Bayer Leverkusen", shortName: "LEV", color: "#E32221" },
      { id: "bay", name: "Bayern Munich", shortName: "BAY", color: "#DC052D" },
      { id: "stg", name: "VfB Stuttgart", shortName: "STU", color: "#E32219" },
      { id: "rbl", name: "RB Leipzig", shortName: "RBL", color: "#DD0741" },
      { id: "bvb", name: "Borussia Dortmund", shortName: "BVB", color: "#FDE100" },
      { id: "fra", name: "Eintracht Frankfurt", shortName: "FRA", color: "#E1000F" },
      { id: "hof", name: "Hoffenheim", shortName: "HOF", color: "#1961B5" },
      { id: "sch", name: "Freiburg", shortName: "FRE", color: "#000000" },
      { id: "aug", name: "Augsburg", shortName: "AUG", color: "#BA3733" },
      { id: "ber", name: "Union Berlin", shortName: "UNB", color: "#EB1923" },
      { id: "wer", name: "Werder Bremen", shortName: "SVW", color: "#1D9053" },
      { id: "hei", name: "Heidenheim", shortName: "HEI", color: "#ED1C24" },
      { id: "boc", name: "VfL Bochum", shortName: "BOC", color: "#005BA5" },
      { id: "wlf", name: "Wolfsburg", shortName: "WOB", color: "#65B32E" },
      { id: "bmg", name: "Borussia Mönchengladbach", shortName: "BMG", color: "#000000" },
      { id: "mai", name: "Mainz 05", shortName: "M05", color: "#ED1C24" },
      { id: "kol", name: "Köln", shortName: "KOE", color: "#ED1C24" },
      { id: "dar", name: "Darmstadt 98", shortName: "DAR", color: "#004E9E" },
    ],
    "ligue-1": [
      { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", color: "#004170" },
      { id: "mon", name: "Monaco", shortName: "MON", color: "#E62433" },
      { id: "bre", name: "Brest", shortName: "BRE", color: "#E30613" },
      { id: "lil", name: "Lille", shortName: "LIL", color: "#E12C1E" },
      { id: "nic", name: "Nice", shortName: "NIC", color: "#000000" },
      { id: "len", name: "Lens", shortName: "LEN", color: "#FFD700" },
      { id: "oly", name: "Lyon", shortName: "OL", color: "#0A3F87" },
      { id: "mar", name: "Marseille", shortName: "OM", color: "#2FAEE0" },
      { id: "rei", name: "Reims", shortName: "REI", color: "#BB0B0C" },
      { id: "ren", name: "Rennes", shortName: "REN", color: "#E30613" },
      { id: "str", name: "Strasbourg", shortName: "STR", color: "#009FE3" },
      { id: "tou", name: "Toulouse", shortName: "TOU", color: "#5B2B82" },
      { id: "nan", name: "Nantes", shortName: "NAN", color: "#FCDD09" },
      { id: "mon", name: "Montpellier", shortName: "MON", color: "#FF6600" },
      { id: "hac", name: "Le Havre", shortName: "HAC", color: "#00529F" },
      { id: "lor", name: "Lorient", shortName: "LOR", color: "#F26522" },
      { id: "met", name: "Metz", shortName: "MET", color: "#811F22" },
      { id: "cle", name: "Clermont Foot", shortName: "CLF", color: "#E1171E" },
    ],
    "champions-league": [
      { id: "rma", name: "Real Madrid", shortName: "RMA", color: "#FEBE10" },
      { id: "mci", name: "Manchester City", shortName: "MCI", color: "#6CABDD" },
      { id: "bay", name: "Bayern Munich", shortName: "BAY", color: "#DC052D" },
      { id: "ars", name: "Arsenal", shortName: "ARS", color: "#EF0107" },
      { id: "fcb", name: "FC Barcelona", shortName: "BAR", color: "#A50044" },
      { id: "bvb", name: "Borussia Dortmund", shortName: "BVB", color: "#FDE100" },
      { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", color: "#004170" },
      { id: "int", name: "Inter Milan", shortName: "INT", color: "#0068A8" },
      { id: "atm", name: "Atlético Madrid", shortName: "ATM", color: "#CB3524" },
      { id: "laz", name: "Lazio", shortName: "LAZ", color: "#89D0F0" },
      { id: "nap", name: "Napoli", shortName: "NAP", color: "#12A0D7" },
      { id: "por", name: "Porto", shortName: "POR", color: "#003893" },
      { id: "ben", name: "Benfica", shortName: "BEN", color: "#FF0000" },
      { id: "rbk", name: "RB Salzburg", shortName: "SAL", color: "#EE2524" },
      { id: "sha", name: "Shakhtar Donetsk", shortName: "SHA", color: "#F48120" },
      { id: "cel", name: "Celtic", shortName: "CEL", color: "#009E49" },
    ],
  };

  const teams = teamsData[leagueId] || teamsData["premier-league"];
  const standings: TeamStanding[] = [];

  // Generate standings with realistic data
  let totalPoints = 90 + Math.floor(Math.random() * 10);
  
  teams.forEach((team, index) => {
    const played = 28 + Math.floor(Math.random() * 10);
    const won = Math.max(0, Math.floor(totalPoints / 3) - Math.floor(Math.random() * 5));
    const drawn = Math.max(0, Math.floor(Math.random() * (played - won)));
    const lost = played - won - drawn;
    const goalsFor = won * 2 + drawn + Math.floor(Math.random() * 20);
    const goalsAgainst = lost * 2 + drawn + Math.floor(Math.random() * 15);
    const points = won * 3 + drawn;
    
    // Generate form (last 5 matches)
    const form: ("W" | "D" | "L")[] = [];
    for (let i = 0; i < 5; i++) {
      const rand = Math.random();
      if (index < 4) {
        form.push(rand > 0.3 ? "W" : rand > 0.1 ? "D" : "L");
      } else if (index > teams.length - 4) {
        form.push(rand > 0.6 ? "W" : rand > 0.3 ? "D" : "L");
      } else {
        form.push(rand > 0.5 ? "W" : rand > 0.25 ? "D" : "L");
      }
    }

    // Generate sentiment
    const sentimentScore = index < 4 
      ? 70 + Math.floor(Math.random() * 25)
      : index > teams.length - 4 
        ? 20 + Math.floor(Math.random() * 30)
        : 40 + Math.floor(Math.random() * 35);
    
    const sentimentTrend: "up" | "down" | "stable" = 
      Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "stable" : "down";
    
    const emoji = sentimentScore >= 75 ? "🔥" : 
                  sentimentScore >= 60 ? "😊" : 
                  sentimentScore >= 45 ? "😐" : 
                  sentimentScore >= 30 ? "😟" : "😢";

    standings.push({
      position: index + 1,
      team,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points,
      form,
      sentiment: {
        score: sentimentScore,
        trend: sentimentTrend,
        emoji,
      },
    });

    totalPoints = Math.max(10, totalPoints - Math.floor(Math.random() * 8) - 2);
  });

  // Sort by points descending
  return standings.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}

function PositionBadge({ position, totalTeams }: { position: number; totalTeams: number }) {
  if (position === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold shadow-lg">
        <Trophy className="w-4 h-4" />
      </div>
    );
  }
  if (position === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold shadow-md">
        <Medal className="w-4 h-4" />
      </div>
    );
  }
  if (position === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold shadow-md">
        <Medal className="w-4 h-4" />
      </div>
    );
  }
  if (position <= 4) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
        {position}
      </div>
    );
  }
  if (position > totalTeams - 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20 text-destructive font-bold">
        {position}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 text-muted-foreground font-medium">
      {position}
    </div>
  );
}

function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const styles = {
    W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    D: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    L: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-md border",
      styles[result]
    )}>
      {result}
    </span>
  );
}

function SentimentCell({ sentiment }: { sentiment: TeamStanding["sentiment"] }) {
  const TrendIcon = sentiment.trend === "up" 
    ? TrendingUp 
    : sentiment.trend === "down" 
      ? TrendingDown 
      : Minus;

  const trendColor = sentiment.trend === "up" 
    ? "text-success" 
    : sentiment.trend === "down" 
      ? "text-destructive" 
      : "text-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{sentiment.emoji}</span>
      <div className="flex items-center gap-1">
        <span className="font-medium text-sm">{sentiment.score}</span>
        <TrendIcon className={cn("w-3 h-3", trendColor)} />
      </div>
    </div>
  );
}

export function LeagueStandings({ leagueId, leagueName, leagueFlag }: LeagueStandingsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const standings = useMemo(() => generateStandings(leagueId), [leagueId]);

  const sortedStandings = useMemo(() => {
    const sorted = [...standings];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case "position":
          comparison = a.position - b.position;
          break;
        case "team":
          comparison = a.team.name.localeCompare(b.team.name);
          break;
        case "played":
          comparison = a.played - b.played;
          break;
        case "won":
          comparison = a.won - b.won;
          break;
        case "drawn":
          comparison = a.drawn - b.drawn;
          break;
        case "lost":
          comparison = a.lost - b.lost;
          break;
        case "goalsFor":
          comparison = a.goalsFor - b.goalsFor;
          break;
        case "goalsAgainst":
          comparison = a.goalsAgainst - b.goalsAgainst;
          break;
        case "goalDifference":
          comparison = a.goalDifference - b.goalDifference;
          break;
        case "points":
          comparison = a.points - b.points;
          break;
        case "sentiment":
          comparison = a.sentiment.score - b.sentiment.score;
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return sorted;
  }, [standings, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "position" ? "asc" : "desc");
    }
  };

  const SortableHeader = ({ 
    columnKey, 
    children, 
    className 
  }: { 
    columnKey: SortKey; 
    children: React.ReactNode; 
    className?: string;
  }) => (
    <TableHead 
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors select-none", className)}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey === columnKey && (
          sortDirection === "asc" 
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />
        )}
        {sortKey !== columnKey && (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl">{leagueFlag}</span>
        </div>
        <h3 className="text-xl font-bold">
          {leagueName} Standings
        </h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-5 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm" />
          <span className="text-muted-foreground">Champions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500/60" />
          <span className="text-muted-foreground">Champions League</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/60" />
          <span className="text-muted-foreground">Relegation Zone</span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto rounded-lg border border-border/30">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/30">
              <SortableHeader columnKey="position" className="w-12"># ↕</SortableHeader>
              <SortableHeader columnKey="team" className="min-w-[160px]">Team ↕</SortableHeader>
              <SortableHeader columnKey="played" className="text-center">P ↕</SortableHeader>
              <SortableHeader columnKey="won" className="text-center">W ↕</SortableHeader>
              <SortableHeader columnKey="drawn" className="text-center">D ↕</SortableHeader>
              <SortableHeader columnKey="lost" className="text-center">L ↕</SortableHeader>
              <SortableHeader columnKey="goalsFor" className="text-center">GF ↕</SortableHeader>
              <SortableHeader columnKey="goalsAgainst" className="text-center">GA ↕</SortableHeader>
              <SortableHeader columnKey="goalDifference" className="text-center">GD ↕</SortableHeader>
              <SortableHeader columnKey="points" className="text-center font-bold">Pts ↕</SortableHeader>
              <TableHead className="hidden md:table-cell min-w-[150px]">Form</TableHead>
              <SortableHeader columnKey="sentiment" className="min-w-[110px]">Sentiment ↕</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStandings.map((standing, index) => {
              const isRelegation = standing.position > standings.length - 3;
              const isChampionsLeague = standing.position <= 4;
              
              return (
                <motion.tr
                  key={standing.team.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    "border-b border-border/20 transition-all duration-200",
                    isRelegation && "bg-rose-500/5 hover:bg-rose-500/10",
                    isChampionsLeague && !isRelegation && "bg-blue-500/5 hover:bg-blue-500/10",
                    !isRelegation && !isChampionsLeague && "hover:bg-muted/30"
                  )}
                >
                  <TableCell className="py-3">
                    <PositionBadge position={standing.position} totalTeams={standings.length} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white/10" 
                        style={{ backgroundColor: standing.team.color }}
                      />
                      <span className="font-medium hidden sm:inline">{standing.team.name}</span>
                      <span className="font-medium sm:hidden">{standing.team.shortName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.played}</TableCell>
                  <TableCell className="text-center py-3 text-emerald-500 font-medium">{standing.won}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.drawn}</TableCell>
                  <TableCell className="text-center py-3 text-rose-500">{standing.lost}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.goalsFor}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.goalsAgainst}</TableCell>
                  <TableCell className={cn(
                    "text-center py-3 font-medium",
                    standing.goalDifference > 0 && "text-emerald-500",
                    standing.goalDifference < 0 && "text-rose-500",
                    standing.goalDifference === 0 && "text-muted-foreground"
                  )}>
                    {standing.goalDifference > 0 ? "+" : ""}{standing.goalDifference}
                  </TableCell>
                  <TableCell className="text-center py-3 font-bold text-lg">{standing.points}</TableCell>
                  <TableCell className="hidden md:table-cell py-3">
                    <div className="flex gap-1">
                      {standing.form.map((result, i) => (
                        <FormBadge key={i} result={result} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <SentimentCell sentiment={standing.sentiment} />
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}