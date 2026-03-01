import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// ── Sentiment helpers ─────────────────────────────────────────────
const SENTIMENT_SCALE = [
  { emoji: "🔥", label: "On Fire", range: [90, 100] },
  { emoji: "😍", label: "Love It", range: [70, 89] },
  { emoji: "🙂", label: "Good", range: [50, 69] },
  { emoji: "😐", label: "Meh", range: [30, 49] },
  { emoji: "😤", label: "Frustrated", range: [10, 29] },
  { emoji: "💩", label: "Awful", range: [0, 9] },
];

function getMood(score: number) {
  return SENTIMENT_SCALE.find(s => score >= s.range[0] && score <= s.range[1]) || SENTIMENT_SCALE[2];
}

// ── Types ─────────────────────────────────────────────────────────
interface TOTWPlayer {
  position: string;
  name: string;
  team: string;
  score: number;
  reason: string;
  tweets: string;
}

interface WeekData {
  week: number;
  totalTweets: string;
  totalTweetsCount: number;
  formation: string;
  generatedAt: string;
  aiExplanation: string;
  players: TOTWPlayer[];
  alternateXI: TOTWPlayer[];
}

// ── Sample data ───────────────────────────────────────────────────
const WEEKS: WeekData[] = [
  {
    week: 15,
    totalTweets: "2.1M",
    totalTweetsCount: 2100000,
    formation: "4-3-3",
    generatedAt: "2026-03-01T10:00:00Z",
    aiExplanation: "This week's XI is dominated by Premier League performers. Haaland's hat-trick generated the most positive fan sentiment across all leagues, while Salah's consistent brilliance keeps him in the side. The defense is anchored by Saliba who was praised for a masterclass against Chelsea.",
    players: [
      { position: "GK", name: "Pickford", team: "Everton", score: 89, reason: "Fans praised his incredible double save against Liverpool. 'Best keeper in England' trending.", tweets: "1.8K" },
      { position: "RB", name: "Alexander-Arnold", team: "Liverpool", score: 91, reason: "Assist masterclass with 3 key passes. Fans calling him the 'best RB ever' after pinpoint crosses.", tweets: "3.2K" },
      { position: "CB", name: "Saliba", team: "Arsenal", score: 88, reason: "Defensive masterclass against Chelsea. 'A wall' was the most used description in 2.1K tweets.", tweets: "2.1K" },
      { position: "CB", name: "Rüdiger", team: "Real Madrid", score: 84, reason: "Dominated in El Clásico. Fans loved his aggressive defending and leadership.", tweets: "1.6K" },
      { position: "LB", name: "Robertson", team: "Liverpool", score: 82, reason: "Tireless running and an assist. Scottish fans especially vocal in their praise.", tweets: "1.2K" },
      { position: "CM", name: "De Bruyne", team: "Man City", score: 93, reason: "3 assists in one game. 'The maestro is back' was the top trending phrase about him.", tweets: "3.8K" },
      { position: "CM", name: "Rodri", team: "Man City", score: 90, reason: "Controlled the midfield completely. Fans comparing him to Busquets in his prime.", tweets: "2.4K" },
      { position: "CM", name: "Pedri", team: "Barcelona", score: 86, reason: "Elegant passing display in El Clásico. 'Xavi regen' trending among Barça fans.", tweets: "1.9K" },
      { position: "RW", name: "Salah", team: "Liverpool", score: 95, reason: "2 goals and an assist. Egyptian King sentiment at all-time high. Contract renewal demands everywhere.", tweets: "4.5K" },
      { position: "LW", name: "Vinícius Jr", team: "Real Madrid", score: 94, reason: "Destroyed Barcelona's defense. Ballon d'Or chants trending worldwide after his performance.", tweets: "5.1K" },
      { position: "ST", name: "Haaland", team: "Man City", score: 96, reason: "Hat-trick hero! 'Unstoppable', 'machine', and 'GOAT striker' dominated fan tweets.", tweets: "6.2K" },
    ],
    alternateXI: [
      { position: "GK", name: "Oblak", team: "Atlético", score: 85, reason: "Clean sheet specialist, fans love his consistency.", tweets: "980" },
      { position: "RB", name: "Hakimi", team: "PSG", score: 80, reason: "Bombing runs impressed fans despite PSG's poor form.", tweets: "1.1K" },
      { position: "CB", name: "Van Dijk", team: "Liverpool", score: 83, reason: "Commanding presence praised by fans.", tweets: "1.5K" },
      { position: "CB", name: "Araujo", team: "Barcelona", score: 81, reason: "Speed and power combination praised.", tweets: "890" },
      { position: "LB", name: "Balde", team: "Barcelona", score: 78, reason: "Young star's runs down the left excited fans.", tweets: "720" },
      { position: "CM", name: "Musiala", team: "Bayern", score: 87, reason: "Dribbling genius drawing comparisons to Iniesta.", tweets: "2.7K" },
      { position: "CM", name: "Bellingham", team: "Real Madrid", score: 79, reason: "Quieter week but still praised for work rate.", tweets: "2.2K" },
      { position: "CM", name: "Rice", team: "Arsenal", score: 77, reason: "Defensive shield role earning growing respect.", tweets: "1.3K" },
      { position: "RW", name: "Saka", team: "Arsenal", score: 85, reason: "Consistent threat, fans love the Starboy.", tweets: "2.1K" },
      { position: "LW", name: "Yamal", team: "Barcelona", score: 91, reason: "Teenager wowing fans with every touch.", tweets: "4.8K" },
      { position: "ST", name: "Kane", team: "Bayern", score: 83, reason: "Goals keep coming, Bundesliga record chase.", tweets: "2.0K" },
    ],
  },
  {
    week: 14,
    totalTweets: "1.8M",
    totalTweetsCount: 1800000,
    formation: "4-3-3",
    generatedAt: "2026-02-22T10:00:00Z",
    aiExplanation: "Week 14 saw La Liga dominate with El Derbi generating massive sentiment. Yamal stole the show with a brace that had fans comparing him to a young Messi.",
    players: [
      { position: "GK", name: "Oblak", team: "Atlético", score: 87, reason: "Penalty save had fans going wild. 'Best GK' trending.", tweets: "1.5K" },
      { position: "RB", name: "Carvajal", team: "Real Madrid", score: 85, reason: "Solid defensive display praised by Madrid fans.", tweets: "1.2K" },
      { position: "CB", name: "Van Dijk", team: "Liverpool", score: 90, reason: "Commanding performance, fans called him 'unbeatable'.", tweets: "2.4K" },
      { position: "CB", name: "Araujo", team: "Barcelona", score: 84, reason: "Speed praised in recovery runs.", tweets: "1.1K" },
      { position: "LB", name: "Balde", team: "Barcelona", score: 80, reason: "Attacking runs thrilled fans.", tweets: "920" },
      { position: "CM", name: "Bellingham", team: "Real Madrid", score: 88, reason: "Scored a screamer, fans in awe.", tweets: "3.1K" },
      { position: "CM", name: "Musiala", team: "Bayern", score: 91, reason: "Dribbling masterclass, compared to Iniesta.", tweets: "2.8K" },
      { position: "CM", name: "Rodri", team: "Man City", score: 86, reason: "Controlled tempo, fans praised composure.", tweets: "1.9K" },
      { position: "RW", name: "Yamal", team: "Barcelona", score: 94, reason: "Brace in El Derbi! 'The next Messi' exploded on X.", tweets: "5.2K" },
      { position: "LW", name: "Salah", team: "Liverpool", score: 92, reason: "Another goal, contract saga boosting engagement.", tweets: "4.0K" },
      { position: "ST", name: "Kane", team: "Bayern", score: 90, reason: "Bundesliga record in sight, fans celebrating.", tweets: "2.6K" },
    ],
    alternateXI: [
      { position: "GK", name: "Pickford", team: "Everton", score: 82, reason: "Strong saves earned praise.", tweets: "780" },
      { position: "RB", name: "Alexander-Arnold", team: "Liverpool", score: 84, reason: "Creative passing from deep.", tweets: "2.0K" },
      { position: "CB", name: "Saliba", team: "Arsenal", score: 83, reason: "Consistent, fans rely on him.", tweets: "1.4K" },
      { position: "CB", name: "Rüdiger", team: "Real Madrid", score: 80, reason: "Physical presence liked.", tweets: "1.0K" },
      { position: "LB", name: "Robertson", team: "Liverpool", score: 79, reason: "Energy praised by fans.", tweets: "980" },
      { position: "CM", name: "De Bruyne", team: "Man City", score: 85, reason: "Vision unmatched, fans say.", tweets: "2.5K" },
      { position: "CM", name: "Pedri", team: "Barcelona", score: 82, reason: "Smooth passing displays.", tweets: "1.4K" },
      { position: "CM", name: "Rice", team: "Arsenal", score: 78, reason: "Defensive discipline praised.", tweets: "1.1K" },
      { position: "RW", name: "Saka", team: "Arsenal", score: 86, reason: "Work rate adored by fans.", tweets: "2.0K" },
      { position: "LW", name: "Vinícius Jr", team: "Real Madrid", score: 88, reason: "Flashes of brilliance.", tweets: "3.8K" },
      { position: "ST", name: "Haaland", team: "Man City", score: 87, reason: "Goal machine keeps going.", tweets: "3.5K" },
    ],
  },
];

// ── Formation layout helpers ──────────────────────────────────────
// Index mapping for 4-3-3 display: [GK], [RB, CB, CB, LB], [CM, CM, CM], [RW, LW], [ST]
function getFormationRows(players: TOTWPlayer[]) {
  return {
    gk: [players[0]],
    defense: [players[1], players[2], players[3], players[4]],
    midfield: [players[5], players[6], players[7]],
    wings: [players[8], players[9]],
    striker: [players[10]],
  };
}

// ── Component ─────────────────────────────────────────────────────
export function TeamOfWeekTab() {
  const [selectedWeek, setSelectedWeek] = useState(15);
  const [showAlternate, setShowAlternate] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const weekData = WEEKS.find(w => w.week === selectedWeek) || WEEKS[0];
  const currentPlayers = showAlternate ? weekData.alternateXI : weekData.players;
  const rows = getFormationRows(currentPlayers);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">🏆 Team of the Week</p>
        <p className="text-lg font-bold text-foreground mt-1">Week {selectedWeek}</p>
        <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
          <span>🤖 Generated by Gemini AI from</span>
          <span className="font-semibold text-foreground">{weekData.totalTweets}</span>
          <span>tweets</span>
        </p>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 justify-center">
        {WEEKS.map(w => (
          <button
            key={w.week}
            onClick={() => { setSelectedWeek(w.week); setShowAlternate(false); }}
            className={`text-[11px] px-4 py-1.5 rounded-full border transition-all ${
              selectedWeek === w.week
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
            }`}
          >
            Week {w.week}
          </button>
        ))}
      </div>

      {/* Main/Alt toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setShowAlternate(false)}
          className={`text-[11px] px-4 py-1.5 rounded-full border transition-all ${
            !showAlternate
              ? "bg-[hsl(var(--ai-green))]/15 text-[hsl(var(--ai-green))] border-[hsl(var(--ai-green))]/30"
              : "bg-card text-muted-foreground border-border"
          }`}
        >
          🏆 Main XI
        </button>
        <button
          onClick={() => setShowAlternate(true)}
          className={`text-[11px] px-4 py-1.5 rounded-full border transition-all ${
            showAlternate
              ? "bg-[hsl(var(--ai-green))]/15 text-[hsl(var(--ai-green))] border-[hsl(var(--ai-green))]/30"
              : "bg-card text-muted-foreground border-border"
          }`}
        >
          Alternative XI
        </button>
      </div>

      {/* Formation pitch */}
      <div className="bg-gradient-to-b from-[hsl(var(--ai-green))]/5 to-card border border-border rounded-2xl p-4 relative overflow-hidden">
        {/* Pitch lines */}
        <div className="absolute inset-4 border border-[hsl(var(--ai-green))]/10 rounded-xl" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-[hsl(var(--ai-green))]/10" />
        <div className="absolute left-1/4 right-1/4 top-4 h-16 border border-[hsl(var(--ai-green))]/10 rounded-b-xl border-t-0" />
        <div className="absolute left-1/4 right-1/4 bottom-4 h-16 border border-[hsl(var(--ai-green))]/10 rounded-t-xl border-b-0" />

        <div className="relative z-10 space-y-4 py-2">
          {/* ST */}
          <FormationRow players={rows.striker} />
          {/* Wings */}
          <FormationRow players={rows.wings} />
          {/* Midfield */}
          <FormationRow players={rows.midfield} />
          {/* Defense */}
          <FormationRow players={rows.defense} />
          {/* GK */}
          <FormationRow players={rows.gk} />
        </div>

        {/* Formation label */}
        <div className="text-center mt-2">
          <Badge variant="outline" className="text-[9px] border-[hsl(var(--ai-green))]/20 text-[hsl(var(--ai-green))]">
            {weekData.formation}
          </Badge>
        </div>
      </div>

      {/* AI Generated badge */}
      <div className="flex items-center justify-center gap-2 bg-[hsl(var(--ai-green))]/10 border border-[hsl(var(--ai-green))]/20 rounded-xl px-3 py-2">
        <span className="text-sm">🤖</span>
        <p className="text-[11px] text-foreground font-medium">Generated by Gemini AI</p>
        <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] py-0">
          ✅ Complete
        </Badge>
      </div>

      {/* Why this team? */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="w-full text-left bg-card border border-border rounded-xl px-3 py-2.5 transition-all hover:border-muted-foreground/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">🤔 Why this team?</span>
          <span className="text-xs text-muted-foreground">{showExplanation ? "▲" : "▼"}</span>
        </div>
      </button>
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-t-0 border-border rounded-b-xl px-3 py-3 -mt-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{weekData.aiExplanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection explanations list */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">
          {showAlternate ? "Alternative" : "Main"} XI — AI Selection Reasoning
        </p>
        <div className="space-y-1.5">
          {currentPlayers.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[8px] py-0 px-1.5 border-muted-foreground/20 text-muted-foreground">
                  {p.position}
                </Badge>
                <span className="text-sm font-semibold text-foreground">{p.name}</span>
                <span className="text-sm">{getMood(p.score).emoji}</span>
                <span className="text-xs font-bold text-foreground ml-auto">{p.score}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{p.reason}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-muted-foreground">{p.team}</span>
                <span className="text-[9px] text-muted-foreground">• 📊 {p.tweets} tweets</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Fan sentiment from X.com</span>
        <span>•</span>
        <span className="text-[hsl(var(--ai-green))]">🤖 Gemini AI</span>
      </div>
    </div>
  );
}

// ── Formation Row ─────────────────────────────────────────────────
function FormationRow({ players }: { players: TOTWPlayer[] }) {
  return (
    <div className="flex justify-around items-center">
      {players.map((p) => {
        const mood = getMood(p.score);
        const isOnFire = p.score >= 90;
        return (
          <motion.div
            key={p.name}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center relative"
          >
            {isOnFire && (
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -inset-1 rounded-full bg-[hsl(var(--warning))]/20 blur-sm"
              />
            )}
            <span className="text-2xl relative z-10">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-foreground relative z-10 mt-0.5">{p.name}</span>
            <div className="flex items-center gap-1 relative z-10">
              <span className="text-[8px] text-muted-foreground">{p.position}</span>
              <span className="text-[8px] font-bold text-foreground">{p.score}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
