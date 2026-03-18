import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeamLogo } from "@/lib/teamLogos";

interface BracketSlot {
  team1: string;
  team1Short: string;
  team2: string;
  team2Short: string;
  confirmed: boolean;
}

const QF_MATCHUPS: BracketSlot[] = [
  {
    team1: "Paris Saint-Germain",
    team1Short: "PSG",
    team2: "Liverpool / Galatasaray",
    team2Short: "TBD",
    confirmed: false,
  },
  {
    team1: "Real Madrid",
    team1Short: "Real Madrid",
    team2: "Bayern Munich / Atalanta",
    team2Short: "TBD",
    confirmed: false,
  },
  {
    team1: "Arsenal",
    team1Short: "Arsenal",
    team2: "TBD",
    team2Short: "TBD",
    confirmed: false,
  },
  {
    team1: "Sporting CP",
    team1Short: "Sporting",
    team2: "TBD",
    team2Short: "TBD",
    confirmed: false,
  },
];

const LAST_NIGHT_RESULTS = [
  { winner: "Real Madrid", loser: "Man City", score: "Agg 5-1", emoji: "🔥" },
  { winner: "Arsenal", loser: "Leverkusen", score: "Agg 3-1", emoji: "💪" },
  { winner: "PSG", loser: "Chelsea", score: "Agg 8-2", emoji: "😤" },
  { winner: "Sporting", loser: "Bodø/Glimt", score: "Agg 5-3 AET", emoji: "🎉" },
];

export function UCLBracket() {
  return (
    <div className="space-y-4">
      {/* Last Night's Results */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <h3 className="text-sm font-bold text-foreground">
            UCL R16 Results — March 17
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LAST_NIGHT_RESULTS.map((r) => (
            <Card key={r.winner} className="overflow-hidden">
              <CardContent className="p-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <img
                    src={getTeamLogo(r.winner)}
                    alt={r.winner}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-xs font-semibold text-foreground truncate">
                    {r.winner}
                  </span>
                  <span className="text-sm">{r.emoji}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">
                    beat {r.loser}
                  </span>
                  <Badge variant="secondary" className="text-[8px]">
                    {r.score}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quarter-Final Bracket */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="text-sm font-bold text-foreground">
            Quarter-Final Draw (Confirmed Slots)
          </h3>
        </div>
        <div className="space-y-2">
          {QF_MATCHUPS.map((matchup, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge
                        variant="outline"
                        className="text-[9px] shrink-0"
                      >
                        QF{i + 1}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <img
                          src={getTeamLogo(matchup.team1Short)}
                          alt={matchup.team1Short}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-xs font-medium text-foreground">
                          {matchup.team1}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground mx-2">
                      vs
                    </span>
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="text-xs text-muted-foreground">
                        {matchup.team2}
                      </span>
                      {matchup.team2Short !== "TBD" && (
                        <img
                          src={getTeamLogo(matchup.team2Short)}
                          alt={matchup.team2Short}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground text-center">
          Remaining QF slots determined by tonight's results
        </p>
      </div>
    </div>
  );
}
