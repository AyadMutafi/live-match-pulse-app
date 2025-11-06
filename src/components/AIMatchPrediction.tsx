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
            {/* Team Condition */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">{prediction.homeTeam}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Form:</span> 
                    <span className="ml-2 font-mono">{prediction.teamCondition?.home?.form || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Record:</span> 
                    <span className="ml-2">{prediction.teamCondition?.home?.wins}W-{prediction.teamCondition?.home?.draws}D-{prediction.teamCondition?.home?.losses}L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Goals:</span> 
                    <span className="ml-2">{prediction.teamCondition?.home?.avgGoalsScored} scored, {prediction.teamCondition?.home?.avgGoalsConceded} conceded/game</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground">Fan Pulse:</span> 
                    <span className="ml-2">{prediction.fanPulse?.home?.avgIntensity}/100 ({prediction.fanPulse?.home?.sentiment})</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">{prediction.awayTeam}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Form:</span> 
                    <span className="ml-2 font-mono">{prediction.teamCondition?.away?.form || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Record:</span> 
                    <span className="ml-2">{prediction.teamCondition?.away?.wins}W-{prediction.teamCondition?.away?.draws}D-{prediction.teamCondition?.away?.losses}L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Goals:</span> 
                    <span className="ml-2">{prediction.teamCondition?.away?.avgGoalsScored} scored, {prediction.teamCondition?.away?.avgGoalsConceded} conceded/game</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground">Fan Pulse:</span> 
                    <span className="ml-2">{prediction.fanPulse?.away?.avgIntensity}/100 ({prediction.fanPulse?.away?.sentiment})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Predictions */}
            {prediction.fanPredictions?.totalPredictions > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Fan Predictions ({prediction.fanPredictions.totalPredictions} fans)</h4>
                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  <div>
                    <div className="text-muted-foreground">Home Win</div>
                    <div className="text-lg font-bold">{Math.round(prediction.fanPredictions.homeWinPredictions / prediction.fanPredictions.totalPredictions * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Draw</div>
                    <div className="text-lg font-bold">{Math.round(prediction.fanPredictions.drawPredictions / prediction.fanPredictions.totalPredictions * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Away Win</div>
                    <div className="text-lg font-bold">{Math.round(prediction.fanPredictions.awayWinPredictions / prediction.fanPredictions.totalPredictions * 100)}%</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Prediction */}
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Prediction
              </h4>
              <pre className="whitespace-pre-wrap text-sm bg-background/50 p-3 rounded">
                {typeof prediction.prediction === 'string' 
                  ? prediction.prediction 
                  : JSON.stringify(prediction.prediction, null, 2)}
              </pre>
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