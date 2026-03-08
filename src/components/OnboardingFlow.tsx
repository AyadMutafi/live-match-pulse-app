import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { TARGET_CLUBS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OnboardingFlowProps {
  onComplete: (selectedClubs: string[]) => void;
}

const LEAGUES = [...new Set(TARGET_CLUBS.map((c) => c.league))];

const LEAGUE_FLAGS: Record<string, string> = {
  "La Liga": "🇪🇸",
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

  const toggleClub = (clubName: string) => {
    setSelectedClubs((prev) =>
      prev.includes(clubName)
        ? prev.filter((c) => c !== clubName)
        : prev.length < 3
          ? [...prev, clubName]
          : prev
    );
  };

  const filteredClubs = selectedLeague
    ? TARGET_CLUBS.filter((c) => c.league === selectedLeague)
    : TARGET_CLUBS;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-2">📡</div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                Welcome to Fan Pulse
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Real-time sentiment analysis of football fans worldwide.
                See how your club's fanbase feels — powered by AI.
              </p>
              <Button
                size="lg"
                className="w-full gap-2 text-base"
                onClick={() => setStep(1)}
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="leagues"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Pick your league
                </h2>
                <p className="text-sm text-muted-foreground">
                  Or browse all clubs at once
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:scale-[1.02]",
                    !selectedLeague && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedLeague(null)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-2xl">🌍</span>
                    <p className="text-sm font-medium mt-1">All Leagues</p>
                  </CardContent>
                </Card>
                {LEAGUES.map((league) => (
                  <Card
                    key={league}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-[1.02]",
                      selectedLeague === league && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedLeague(league)}
                  >
                    <CardContent className="p-4 text-center">
                      <span className="text-2xl">
                        {LEAGUE_FLAGS[league] || "⚽"}
                      </span>
                      <p className="text-sm font-medium mt-1">{league}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => setStep(2)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="clubs"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Choose your clubs
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select up to 3 clubs to personalize your feed
                </p>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredClubs.map((club) => {
                  const isSelected = selectedClubs.includes(club.name);
                  return (
                    <Card
                      key={club.name}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-[1.01]",
                        isSelected && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => toggleClub(club.name)}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: club.color }}
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {club.shortName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {club.league}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {selectedClubs.length}/3 selected
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => onComplete(selectedClubs)}
                    disabled={selectedClubs.length === 0}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Let's Go!
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
