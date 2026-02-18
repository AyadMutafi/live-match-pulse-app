import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Trophy, Medal, ChevronUp, ChevronDown, Minus,
  TrendingUp, TrendingDown, ArrowUpDown, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStandings, type StandingRow } from "@/hooks/useStandings";

interface LeagueStandingsProps {
  leagueId: string;
  leagueName: string;
  leagueFlag: string;
}

const LEAGUE_ID_TO_CODE: Record<string, string> = {
  "premier-league": "PL",
  "la-liga": "PD",
  "serie-a": "SA",
  "bundesliga": "BL1",
  "ligue-1": "FL1",
  "champions-league": "", // no direct code
};

type SortKey = "position" | "team" | "played" | "won" | "drawn" | "lost" | "goalsFor" | "goalsAgainst" | "goalDifference" | "points";
type SortDirection = "asc" | "desc";

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

function FormBadge({ result }: { result: string }) {
  const r = result.toUpperCase() as "W" | "D" | "L";
  const styles: Record<string, string> = {
    W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    D: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    L: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-md border",
      styles[r] || styles["D"]
    )}>
      {r}
    </span>
  );
}

export function LeagueStandings({ leagueId, leagueName, leagueFlag }: LeagueStandingsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const leagueCode = LEAGUE_ID_TO_CODE[leagueId] || "";
  const { data: rawStandings, isLoading, error } = useStandings(leagueCode || undefined);

  const standings = useMemo(() => {
    if (!rawStandings || rawStandings.length === 0) return [];
    return rawStandings;
  }, [rawStandings]);

  const sortedStandings = useMemo(() => {
    const sorted = [...standings];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case "position": comparison = a.position - b.position; break;
        case "team": comparison = a.team_name.localeCompare(b.team_name); break;
        case "played": comparison = a.played - b.played; break;
        case "won": comparison = a.won - b.won; break;
        case "drawn": comparison = a.drawn - b.drawn; break;
        case "lost": comparison = a.lost - b.lost; break;
        case "goalsFor": comparison = a.goals_for - b.goals_for; break;
        case "goalsAgainst": comparison = a.goals_against - b.goals_against; break;
        case "goalDifference": comparison = a.goal_difference - b.goal_difference; break;
        case "points": comparison = a.points - b.points; break;
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

  const SortableHeader = ({ columnKey, children, className }: { columnKey: SortKey; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors select-none", className)}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey === columnKey ? (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading standings...</span>
        </div>
      </Card>
    );
  }

  if (standings.length === 0) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl">{leagueFlag}</span>
          <h3 className="text-xl font-bold">{leagueName} Standings</h3>
        </div>
        <p className="text-center text-muted-foreground py-8">
          No standings data available yet. Data will be fetched shortly.
        </p>
      </Card>
    );
  }

  const lastUpdated = standings[0]?.updated_at
    ? new Date(standings[0].updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl">{leagueFlag}</span>
          <h3 className="text-xl font-bold">{leagueName} Standings</h3>
        </div>
        {lastUpdated && (
          <Badge variant="outline" className="text-xs">Updated {lastUpdated}</Badge>
        )}
      </div>

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
              <SortableHeader columnKey="position" className="w-12">#</SortableHeader>
              <SortableHeader columnKey="team" className="min-w-[160px]">Team</SortableHeader>
              <SortableHeader columnKey="played" className="text-center">P</SortableHeader>
              <SortableHeader columnKey="won" className="text-center">W</SortableHeader>
              <SortableHeader columnKey="drawn" className="text-center">D</SortableHeader>
              <SortableHeader columnKey="lost" className="text-center">L</SortableHeader>
              <SortableHeader columnKey="goalsFor" className="text-center">GF</SortableHeader>
              <SortableHeader columnKey="goalsAgainst" className="text-center">GA</SortableHeader>
              <SortableHeader columnKey="goalDifference" className="text-center">GD</SortableHeader>
              <SortableHeader columnKey="points" className="text-center font-bold">Pts</SortableHeader>
              <TableHead className="hidden md:table-cell min-w-[150px]">Form</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStandings.map((standing, index) => {
              const totalTeams = standings.length;
              const isRelegation = standing.position > totalTeams - 3;
              const isChampionsLeague = standing.position <= 4;
              const formArr = standing.form?.split(",").filter(Boolean) || [];

              return (
                <motion.tr
                  key={standing.id}
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
                    <PositionBadge position={standing.position} totalTeams={totalTeams} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium hidden sm:inline">{standing.team_name}</span>
                      <span className="font-medium sm:hidden">{standing.team_short_name || standing.team_name.slice(0, 3).toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.played}</TableCell>
                  <TableCell className="text-center py-3 text-emerald-500 font-medium">{standing.won}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.drawn}</TableCell>
                  <TableCell className="text-center py-3 text-rose-500">{standing.lost}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.goals_for}</TableCell>
                  <TableCell className="text-center py-3 text-muted-foreground">{standing.goals_against}</TableCell>
                  <TableCell className={cn(
                    "text-center py-3 font-medium",
                    standing.goal_difference > 0 && "text-emerald-500",
                    standing.goal_difference < 0 && "text-rose-500",
                    standing.goal_difference === 0 && "text-muted-foreground"
                  )}>
                    {standing.goal_difference > 0 ? "+" : ""}{standing.goal_difference}
                  </TableCell>
                  <TableCell className="text-center py-3 font-bold text-lg">{standing.points}</TableCell>
                  <TableCell className="hidden md:table-cell py-3">
                    <div className="flex gap-1">
                      {formArr.slice(-5).map((result, i) => (
                        <FormBadge key={i} result={result} />
                      ))}
                    </div>
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
