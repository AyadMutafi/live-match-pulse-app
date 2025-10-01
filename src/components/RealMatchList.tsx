import { useMatches } from "@/hooks/useMatches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";

export function RealMatchList() {
  const { data: matches, isLoading, error } = useMatches();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center text-muted-foreground">
          Error loading matches: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center text-muted-foreground">
          No matches found for Sep 15-30, 2025. Click "Fetch Real Match Data" to load them.
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      scheduled: { variant: "outline", label: "Scheduled" },
      live: { variant: "destructive", label: "Live" },
      in_play: { variant: "destructive", label: "In Play" },
      finished: { variant: "secondary", label: "Finished" },
      postponed: { variant: "outline", label: "Postponed" },
      cancelled: { variant: "outline", label: "Cancelled" },
    };

    const config = statusMap[status.toLowerCase()] || { variant: "default", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Real Matches (Sep 15-30, 2025)
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {match.competition}
                  </span>
                </div>
                {getStatusBadge(match.status)}
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div className="text-right">
                  <p className="font-semibold text-lg">{match.home_team?.name || "Home Team"}</p>
                  <p className="text-sm text-muted-foreground">{match.home_team?.league}</p>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{match.home_score}</div>
                  </div>
                  <span className="text-2xl font-light text-muted-foreground">-</span>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{match.away_score}</div>
                  </div>
                </div>

                <div className="text-left">
                  <p className="font-semibold text-lg">{match.away_team?.name || "Away Team"}</p>
                  <p className="text-sm text-muted-foreground">{match.away_team?.league}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
                {format(new Date(match.match_date), "PPpp")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
