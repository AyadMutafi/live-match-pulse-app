import { Badge } from "@/components/ui/badge";
import { getSentimentCategory, getClubInfo } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { Link } from "react-router-dom";
import { useMatches } from "@/hooks/useMatches";
import { useMemo, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FEATURED_CLUBS = ["Barcelona", "Real Madrid", "Atlético Madrid", "Juventus", "PSG"];

interface ClubSentimentData {
  name: string;
  shortName: string;
  sentiment: number;
  trend: number;
}

function useClubSentiments(): ClubSentimentData[] {
  const { data: matches } = useMatches();

  return useMemo(() => {
    return FEATURED_CLUBS.map((shortName) => {
      const club = getClubInfo(shortName);
      const clubName = club?.name || shortName;
      const clubShort = club?.shortName || shortName;

      const recentMatches = matches?.filter((m) => {
        const status = m.status?.toUpperCase() || "";
        const isFinished = ["FINISHED", "FT", "FULL_TIME"].includes(status);
        const involvedHome = m.home_team?.name?.includes(clubShort) || m.home_team?.name === clubName;
        const involvedAway = m.away_team?.name?.includes(clubShort) || m.away_team?.name === clubName;
        return isFinished && (involvedHome || involvedAway);
      }) || [];

      let sentimentBase = 60;
      let trend = 0;
      recentMatches.slice(0, 5).forEach((m) => {
        const isHome = m.home_team?.name?.includes(clubShort) || m.home_team?.name === clubName;
        const homeScore = m.home_score ?? 0;
        const awayScore = m.away_score ?? 0;
        if (isHome) {
          if (homeScore > awayScore) { sentimentBase += 6; trend += 2; }
          else if (homeScore < awayScore) { sentimentBase -= 5; trend -= 2; }
        } else {
          if (awayScore > homeScore) { sentimentBase += 6; trend += 2; }
          else if (awayScore < homeScore) { sentimentBase -= 5; trend -= 2; }
        }
      });

      return {
        name: clubName,
        shortName: clubShort,
        sentiment: Math.max(10, Math.min(95, sentimentBase)),
        trend: Math.max(-10, Math.min(10, trend)),
      };
    });
  }, [matches]);
}

function ClubChip({ club }: { club: ClubSentimentData }) {
  const logo = getTeamLogo(club.shortName);
  const category = getSentimentCategory(club.sentiment);
  const clubSlug = club.shortName.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/club/${clubSlug}`} className="flex-shrink-0">
      <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer w-20">
        <img
          src={logo}
          alt={club.shortName}
          className="w-10 h-10 object-contain"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(club.shortName)}&background=random&size=128`;
          }}
        />
        <span className="text-xl leading-none">{category.emoji}</span>
        <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center">
          {club.shortName}
        </span>
      </div>
    </Link>
  );
}

export function ClubSentimentOverview() {
  const clubs = useClubSentiments();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Club Sentiment</h2>
        <Badge variant="outline" className="text-[10px]">
          {FEATURED_CLUBS.length} Clubs
        </Badge>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {clubs.map((club) => (
            <ClubChip key={club.shortName} club={club} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
