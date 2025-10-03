import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Sparkles, Calendar } from "lucide-react";
import { useTeamOfWeek } from "@/hooks/useTeamOfWeek";
import { FieldFormation } from "./FieldFormation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMPETITION_WEEKS = [
  { label: "Week 1 (Sep 15-22)", start: "2025-09-15", end: "2025-09-22" },
  { label: "Week 2 (Sep 23-29)", start: "2025-09-23", end: "2025-09-29" },
  { label: "Week 3 (Sep 30 - Oct 2)", start: "2025-09-30", end: "2025-10-02" },
];

function WeekTeamOfWeek({ weekStart, weekEnd, weekLabel }: { weekStart: string; weekEnd: string; weekLabel: string }) {
  const { data, isLoading, error } = useTeamOfWeek(weekStart, weekEnd);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">{weekLabel}</h3>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Based on {data?.matchesAnalyzed} matches analyzed
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
          <div className="space-y-2 text-sm">
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
      </Card>

      <Tabs defaultValue="week1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {COMPETITION_WEEKS.map((week, idx) => (
            <TabsTrigger key={idx} value={`week${idx + 1}`}>
              {week.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {COMPETITION_WEEKS.map((week, idx) => (
          <TabsContent key={idx} value={`week${idx + 1}`}>
            <WeekTeamOfWeek 
              weekStart={week.start} 
              weekEnd={week.end} 
              weekLabel={week.label}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}