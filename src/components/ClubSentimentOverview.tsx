import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, MessageSquare, Calendar } from "lucide-react";
import { TARGET_CLUBS, getSentimentCategory } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { Link } from "react-router-dom";
import { useMatches } from "@/hooks/useMatches";
import { useMemo } from "react";

interface ClubSentimentData {
  name: string;
  shortName: string;
  sentiment: number;
  trend: number;
  mentions: number;
  nextMatch?: {
    opponent: string;
    date: string;
    competition: string;
  };
}

function useClubSentiments(): ClubSentimentData[] {
  const { data: matches } = useMatches();

  return useMemo(() => {
    return TARGET_CLUBS.map((club) => {
      // Find next upcoming match for this club
      const now = new Date();
      const upcomingMatch = matches?.find((m) => {
        const matchDate = new Date(m.match_date);
        const status = m.status?.toUpperCase() || "";
        const isUpcoming = status === "SCHEDULED" || status === "TIMED";
        const involvedHome = m.home_team?.name?.includes(club.shortName) || m.home_team?.name === club.name;
        const involvedAway = m.away_team?.name?.includes(club.shortName) || m.away_team?.name === club.name;
        return isUpcoming && matchDate > now && (involvedHome || involvedAway);
      });

      // Count recent finished matches to derive a basic sentiment proxy
      const recentMatches = matches?.filter((m) => {
        const status = m.status?.toUpperCase() || "";
        const isFinished = ["FINISHED", "FT", "FULL_TIME"].includes(status);
        const involvedHome = m.home_team?.name?.includes(club.shortName) || m.home_team?.name === club.name;
        const involvedAway = m.away_team?.name?.includes(club.shortName) || m.away_team?.name === club.name;
        return isFinished && (involvedHome || involvedAway);
      }) || [];

      // Basic sentiment from results: win = +, draw = 0, loss = -
      let sentimentBase = 60;
      let trend = 0;
      recentMatches.slice(0, 5).forEach((m) => {
        const isHome = m.home_team?.name?.includes(club.shortName) || m.home_team?.name === club.name;
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

      const sentiment = Math.max(10, Math.min(95, sentimentBase));
      const opponent = upcomingMatch
        ? (upcomingMatch.home_team?.name?.includes(club.shortName) || upcomingMatch.home_team?.name === club.name
          ? upcomingMatch.away_team?.name
          : upcomingMatch.home_team?.name) || "TBD"
        : undefined;

      const matchDate = upcomingMatch
        ? new Date(upcomingMatch.match_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : undefined;

      return {
        name: club.name,
        shortName: club.shortName,
        sentiment,
        trend: Math.max(-10, Math.min(10, trend)),
        mentions: Math.floor(20000 + Math.random() * 50000), // Placeholder until social API is wired
        nextMatch: opponent ? { opponent, date: matchDate!, competition: upcomingMatch?.competition || "" } : undefined,
      };
    });
  }, [matches]);
}

function ClubCard({ club }: { club: ClubSentimentData }) {
  const logo = getTeamLogo(club.shortName);
  const category = getSentimentCategory(club.sentiment);
  const clubSlug = club.shortName.toLowerCase().replace(/\s+/g, "-");

  const TrendIcon = club.trend > 0 ? TrendingUp : club.trend < 0 ? TrendingDown : Minus;
  const trendColor = club.trend > 0 ? "text-[hsl(var(--success))]" : club.trend < 0 ? "text-[hsl(var(--destructive))]" : "text-muted-foreground";

  return (
    <Link to={`/club/${clubSlug}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={logo}
              alt={club.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(club.shortName)}&background=random&size=128`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm truncate">{club.shortName}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">{club.sentiment}</span>
                  <span className="text-lg">{category.emoji}</span>
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  <span className={`text-xs font-medium ${trendColor}`}>
                    {club.trend > 0 ? "+" : ""}{club.trend}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] mb-2" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                {category.emoji} {category.name}
              </Badge>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {(club.mentions / 1000).toFixed(1)}K
                </span>
                {club.nextMatch && (
                  <span className="flex items-center gap-1 truncate">
                    <Calendar className="w-3 h-3" />
                    vs {club.nextMatch.opponent.split(" ").slice(0, 2).join(" ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ClubSentimentOverview() {
  const clubs = useClubSentiments();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Club Sentiment Overview</h2>
          <p className="text-xs text-muted-foreground">Sentiment derived from recent match results</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {TARGET_CLUBS.length} Clubs Monitored
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clubs.map((club) => (
          <ClubCard key={club.name} club={club} />
        ))}
      </div>
    </div>
  );
}
