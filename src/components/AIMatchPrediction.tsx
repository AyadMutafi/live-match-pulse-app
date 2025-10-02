import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Sparkles } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { useMatchPrediction } from "@/hooks/useMatchPrediction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AIMatchPrediction() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { data: matches } = useMatches();
  const { data: prediction, isLoading } = useMatchPrediction(selectedMatchId);

  // Filter upcoming matches
  const upcomingMatches = matches?.filter(m => m.status === 'scheduled') || [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Match Predictions</h2>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Upcoming Match:</label>
          <Select onValueChange={setSelectedMatchId} value={selectedMatchId || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a match to predict..." />
            </SelectTrigger>
            <SelectContent>
              {upcomingMatches.map(match => (
                <SelectItem key={match.id} value={match.id}>
                  {match.home_team?.name} vs {match.away_team?.name} - {new Date(match.match_date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {prediction && !isLoading && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                {prediction.homeTeam} vs {prediction.awayTeam}
              </h3>
              <div className="text-sm text-muted-foreground mb-2">
                Recent form: {prediction.homeTeam} ({prediction.homeForm}) vs {prediction.awayTeam} ({prediction.awayForm})
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">AI Prediction:</h4>
                <pre className="whitespace-pre-wrap text-sm bg-background p-3 rounded">
                  {typeof prediction.prediction === 'string' 
                    ? prediction.prediction 
                    : JSON.stringify(prediction.prediction, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {!selectedMatchId && !isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Select a match to see AI-powered predictions based on team form and historical data
          </div>
        )}
      </div>
    </Card>
  );
}