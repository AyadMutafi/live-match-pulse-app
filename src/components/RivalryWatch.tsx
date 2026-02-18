import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, TrendingUp, TrendingDown, Calendar, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { CLUB_RIVALRIES, getSentimentCategory, getClubInfo } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { Link } from "react-router-dom";
import { useMatches } from "@/hooks/useMatches";
import { useMemo } from "react";

interface RivalryData {
  name: string;
  clubs: readonly string[];
  clubA: { name: string; sentiment: number; trend: number; mentions: number };
  clubB: { name: string; sentiment: number; trend: number; mentions: number };
  nextMatch?: { date: string; location: string };
}

function useRivalryData(): RivalryData[] {
  const { data: matches } = useMatches();

  return useMemo(() => {
    return CLUB_RIVALRIES.map((rivalry) => {
      const clubAInfo = getClubInfo(rivalry.clubs[0]);
      const clubBInfo = getClubInfo(rivalry.clubs[1]);

      // Find next match between these rivals
      const now = new Date();
      const nextRivalryMatch = matches?.find((m) => {
        const matchDate = new Date(m.match_date);
        const status = m.status?.toUpperCase() || "";
        if (!["SCHEDULED", "TIMED"].includes(status) || matchDate <= now) return false;

        const homeName = m.home_team?.name || "";
        const awayName = m.away_team?.name || "";

        const involvesA = clubAInfo
          ? homeName.includes(clubAInfo.shortName) || awayName.includes(clubAInfo.shortName)
          : false;
        const involvesB = clubBInfo
          ? homeName.includes(clubBInfo.shortName) || awayName.includes(clubBInfo.shortName)
          : false;
        return involvesA && involvesB;
      });

      const dateStr = nextRivalryMatch
        ? new Date(nextRivalryMatch.match_date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
          })
        : undefined;

      return {
        name: rivalry.name,
        clubs: rivalry.clubs,
        clubA: {
          name: rivalry.clubs[0],
          sentiment: 60 + Math.floor(Math.random() * 25),
          trend: Math.floor(Math.random() * 10) - 3,
          mentions: Math.floor(20000 + Math.random() * 50000),
        },
        clubB: {
          name: rivalry.clubs[1],
          sentiment: 60 + Math.floor(Math.random() * 25),
          trend: Math.floor(Math.random() * 10) - 3,
          mentions: Math.floor(20000 + Math.random() * 50000),
        },
        nextMatch: dateStr ? { date: dateStr, location: "TBD" } : undefined,
      };
    });
  }, [matches]);
}

function RivalryCard({ rivalry }: { rivalry: RivalryData }) {
  const clubAInfo = getClubInfo(rivalry.clubA.name);
  const clubBInfo = getClubInfo(rivalry.clubB.name);
  const clubALogo = getTeamLogo(clubAInfo?.shortName || rivalry.clubA.name);
  const clubBLogo = getTeamLogo(clubBInfo?.shortName || rivalry.clubB.name);

  const categoryA = getSentimentCategory(rivalry.clubA.sentiment);
  const categoryB = getSentimentCategory(rivalry.clubB.sentiment);

  const TrendIconA = rivalry.clubA.trend > 0 ? TrendingUp : TrendingDown;
  const TrendIconB = rivalry.clubB.trend > 0 ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Swords className="w-4 h-4 text-destructive" />
            {rivalry.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <img src={clubALogo} alt={rivalry.clubA.name} className="w-10 h-10 mx-auto object-contain" />
            <p className="text-xs font-medium truncate">{clubAInfo?.shortName || rivalry.clubA.name}</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold">{rivalry.clubA.sentiment}</span>
              <span>{categoryA.emoji}</span>
              <TrendIconA className={`w-3 h-3 ${rivalry.clubA.trend > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <img src={clubBLogo} alt={rivalry.clubB.name} className="w-10 h-10 mx-auto object-contain" />
            <p className="text-xs font-medium truncate">{clubBInfo?.shortName || rivalry.clubB.name}</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold">{rivalry.clubB.sentiment}</span>
              <span>{categoryB.emoji}</span>
              <TrendIconB className={`w-3 h-3 ${rivalry.clubB.trend > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`} />
            </div>
          </div>
        </div>

        {rivalry.nextMatch && (
          <div className="pt-3 border-t border-border space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Next Match: {rivalry.nextMatch.date}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RivalryWatch() {
  const rivalries = useRivalryData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Swords className="w-5 h-5 text-destructive" />
            Rivalry Watch
          </h2>
          <p className="text-xs text-muted-foreground">Head-to-head sentiment battles</p>
        </div>
        <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
          {rivalries.length} Active Rivalries
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rivalries.map((rivalry) => (
          <RivalryCard key={rivalry.name} rivalry={rivalry} />
        ))}
      </div>
    </div>
  );
}
