import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeamLogo } from "@/lib/teamLogos";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ComebackFixture {
  team: string;
  shortName: string;
  opponent: string;
  opponentShort: string;
  aggScore: string;
  deficit: number;
  matchId: string;
  kickoff: string;
}

const COMEBACK_FIXTURES: ComebackFixture[] = [
  {
    team: "Liverpool FC",
    shortName: "Liverpool",
    opponent: "Galatasaray SK",
    opponentShort: "Galatasaray",
    aggScore: "0-1",
    deficit: 1,
    matchId: "0fd09ebd-50e9-4b8d-91b9-bf3661731448",
    kickoff: "20:00",
  },
  {
    team: "Tottenham Hotspur FC",
    shortName: "Tottenham",
    opponent: "Club Atlético de Madrid",
    opponentShort: "Atlético",
    aggScore: "2-5",
    deficit: 3,
    matchId: "789ba980-1d58-4d70-a4fe-b7ce145c1370",
    kickoff: "20:00",
  },
];

function getComebackProbability(deficit: number, hopeSentiment: number): number {
  // Base probability decreases with deficit
  const baseProbability = deficit === 1 ? 45 : deficit === 2 ? 22 : deficit === 3 ? 8 : 3;
  // Hope sentiment (0-100) adds a modifier
  const sentimentBoost = ((hopeSentiment - 50) / 50) * 15;
  return Math.max(2, Math.min(85, Math.round(baseProbability + sentimentBoost)));
}

function getGaugeColor(probability: number): string {
  if (probability >= 40) return "hsl(var(--success))";
  if (probability >= 20) return "hsl(var(--warning, 45 93% 47%))";
  return "hsl(var(--destructive))";
}

export function ComebackProbabilityWidget() {
  const [hopeSentiments, setHopeSentiments] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchSentiments() {
      const matchIds = COMEBACK_FIXTURES.map((f) => f.matchId);
      const { data } = await supabase
        .from("sentiment_snapshots")
        .select("match_id, home_sentiment")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false });

      const sentiments: Record<string, number> = {};
      for (const fixture of COMEBACK_FIXTURES) {
        const snap = data?.find((s) => s.match_id === fixture.matchId);
        sentiments[fixture.matchId] = snap?.home_sentiment || 50;
      }
      setHopeSentiments(sentiments);
    }
    fetchSentiments();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔮</span>
        <h3 className="text-sm font-bold text-foreground">
          Comeback Watch — Can They Do It?
        </h3>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Live "Hope Sentiment" from X.com vs. aggregate deficit
      </p>

      <div className="grid grid-cols-1 gap-3">
        {COMEBACK_FIXTURES.map((fixture, i) => {
          const hope = hopeSentiments[fixture.matchId] || 50;
          const probability = getComebackProbability(fixture.deficit, hope);
          const gaugeColor = getGaugeColor(probability);

          return (
            <motion.div
              key={fixture.matchId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="overflow-hidden border-2 border-border">
                <CardContent className="p-4 space-y-3">
                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getTeamLogo(fixture.shortName)}
                        alt={fixture.shortName}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {fixture.shortName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          vs {fixture.opponentShort}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-[10px]">
                        Agg: {fixture.aggScore}
                      </Badge>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        KO {fixture.kickoff}
                      </p>
                    </div>
                  </div>

                  {/* Gauge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">
                        Comeback Probability
                      </span>
                      <span
                        className="font-bold text-sm"
                        style={{ color: gaugeColor }}
                      >
                        {probability}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: gaugeColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${probability}%` }}
                        transition={{
                          duration: 1.2,
                          delay: i * 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* Hope sentiment */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">
                        {hope >= 65 ? "🔥" : hope >= 45 ? "🙏" : "😰"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Hope Sentiment: {hope}%
                      </span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      {fixture.deficit}-goal deficit
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
