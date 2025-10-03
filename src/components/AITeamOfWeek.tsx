import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Sparkles, Calendar } from "lucide-react";
import { useTeamOfWeek } from "@/hooks/useTeamOfWeek";
import { FieldFormation } from "./FieldFormation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMPETITIONS = [
  { label: "Premier League", start: "2025-09-15", end: "2025-10-02", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { label: "La Liga", start: "2025-09-15", end: "2025-10-02", icon: "🇪🇸" },
  { label: "Serie A", start: "2025-09-15", end: "2025-10-02", icon: "🇮🇹" },
  { label: "Champions League", start: "2025-09-15", end: "2025-10-02", icon: "🏆" },
];

function CompetitionTeamOfWeek({ competition, weekStart, weekEnd }: { competition: string; weekStart: string; weekEnd: string }) {
  const { data, isLoading, error } = useTeamOfWeek(weekStart, weekEnd);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing matches...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Failed to load Team of the Week. {error.message}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-bold">{competition}</h3>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Based on {data?.matchesAnalyzed} matches analyzed (Sep 15 - Oct 2, 2025)
        </div>
      </Card>

      {data?.teamOfWeek && (
        <FieldFormation 
          players={data.teamOfWeek.players} 
          formation={data.teamOfWeek.formation}
        />
      )}

      {data?.matchSummaries && data.matchSummaries.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            Analyzed Matches
          </h3>
          <div className="space-y-2 text-sm max-h-60 overflow-y-auto">
            {data.matchSummaries.map((summary: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span className="text-muted-foreground">{summary}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function AITeamOfWeek() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">AI-Generated Team of the Week</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Select a competition to view the best performing players based on match data and fan sentiment
        </p>
      </Card>

      <Tabs defaultValue="premier-league" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {COMPETITIONS.map((comp, idx) => (
            <TabsTrigger key={idx} value={comp.label.toLowerCase().replace(/\s+/g, '-')}>
              <span className="mr-1">{comp.icon}</span>
              {comp.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {COMPETITIONS.map((comp, idx) => (
          <TabsContent key={idx} value={comp.label.toLowerCase().replace(/\s+/g, '-')}>
            <CompetitionTeamOfWeek 
              competition={comp.label}
              weekStart={comp.start} 
              weekEnd={comp.end}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}