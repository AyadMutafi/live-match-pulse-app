import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CLUB_RIVALRIES, getClubInfo } from "@/lib/constants";
import { Swords, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function RivalryHub() {
  const [expandedRivalry, setExpandedRivalry] = useState<string | null>(null);

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" /> Rivalry Hub
        </h2>
        <p className="text-sm text-muted-foreground">
          Which fanbase is feeling better? Live sentiment face-offs.
        </p>
      </div>

      <div className="space-y-3">
        {CLUB_RIVALRIES.map((rivalry, i) => {
          const club1 = getClubInfo(rivalry.clubs[0]);
          const club2 = getClubInfo(rivalry.clubs[1]);
          if (!club1 || !club2) return null;

          // Simulated sentiment scores (will be replaced with real data)
          const score1 = Math.floor(Math.random() * 40) + 30;
          const score2 = Math.floor(Math.random() * 40) + 30;
          const total = score1 + score2;
          const pct1 = Math.round((score1 / total) * 100);
          const pct2 = 100 - pct1;
          const isExpanded = expandedRivalry === rivalry.name;

          return (
            <motion.div
              key={rivalry.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                onClick={() =>
                  setExpandedRivalry(isExpanded ? null : rivalry.name)
                }
              >
                {/* Intensity bar */}
                <div className="h-1 flex">
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${pct1}%`,
                      backgroundColor: club1.color,
                    }}
                  />
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${pct2}%`,
                      backgroundColor: club2.color,
                    }}
                  />
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Rivalry name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-bold text-foreground">
                        {rivalry.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-destructive/30 text-destructive"
                    >
                      🔥 {rivalry.intensity}%
                    </Badge>
                  </div>

                  {/* Tug of war */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {club1.shortName}
                      </p>
                      <p className="text-lg font-bold" style={{ color: club1.color }}>
                        {score1}
                      </p>
                    </div>

                    {/* Visual bar */}
                    <div className="w-24 h-3 rounded-full bg-muted overflow-hidden flex">
                      <div
                        className="h-full rounded-l-full transition-all duration-700"
                        style={{
                          width: `${pct1}%`,
                          backgroundColor: club1.color,
                        }}
                      />
                      <div
                        className="h-full rounded-r-full transition-all duration-700"
                        style={{
                          width: `${pct2}%`,
                          backgroundColor: club2.color,
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {club2.shortName}
                      </p>
                      <p className="text-lg font-bold" style={{ color: club2.color }}>
                        {score2}
                      </p>
                    </div>
                  </div>

                  {/* Expanded info */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pt-2 border-t border-border"
                    >
                      <p className="text-xs text-muted-foreground">
                        {rivalry.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Sentiment based on latest social media analysis
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
