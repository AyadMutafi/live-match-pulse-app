import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Sparkles } from "lucide-react";
import { useTeamOfWeek } from "@/hooks/useTeamOfWeek";
import { FieldFormation } from "./FieldFormation";

export function AITeamOfWeek() {
  // Week of Sept 15-22, 2025
  const { data, isLoading, error } = useTeamOfWeek('2025-09-15', '2025-09-22');

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
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">AI-Generated Team of the Week</h2>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Based on {data?.matchesAnalyzed} matches from Sept 15-22, 2025
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