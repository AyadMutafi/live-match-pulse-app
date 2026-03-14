import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Zap, Trophy, Swords, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PostMatchRatingFlow } from "./PostMatchRatingFlow";
import { QuickRateMode } from "./QuickRateMode";
import { LiveMatchRating } from "./LiveMatchRating";
import { PlayerSentimentProfile } from "./PlayerSentimentProfile";
import { FanPulseAwards } from "./FanPulseAwards";
import { SentimentShowdown } from "./SentimentShowdown";
import { getMockMatchPlayers, getSentimentEmoji } from "@/lib/fanRatings";

type ActiveView = "hub" | "postmatch" | "quickrate" | "profile" | "awards" | "showdown";

interface SelectedPlayer {
  name: string;
  team: string;
  position: string;
  number: number;
}

export function FanRatingsTab() {
  const [activeView, setActiveView] = useState<ActiveView>("hub");
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);

  // Mock match data
  const mockMatch = {
    id: "mock-match-1",
    title: "Man City 2-1 Arsenal",
    subtitle: "Full Time - Premier League",
    homeTeam: { name: "Manchester City", id: "mci" },
    awayTeam: { name: "Arsenal", id: "ars" },
  };

  const homePlayers = getMockMatchPlayers(mockMatch.homeTeam.name, mockMatch.homeTeam.id);
  const awayPlayers = getMockMatchPlayers(mockMatch.awayTeam.name, mockMatch.awayTeam.id);
  const allPlayers = [...homePlayers, ...awayPlayers];

  // Top rated players (mock)
  const topPlayers = [
    { name: "Erling Haaland", team: "Manchester City", sentiment: 94, pos: "FW", num: 9 },
    { name: "Mohamed Salah", team: "Liverpool", sentiment: 91, pos: "FW", num: 11 },
    { name: "Bukayo Saka", team: "Arsenal", sentiment: 88, pos: "FW", num: 7 },
    { name: "Cole Palmer", team: "Chelsea", sentiment: 87, pos: "MF", num: 20 },
    { name: "Virgil van Dijk", team: "Liverpool", sentiment: 85, pos: "DF", num: 4 },
  ];

  if (activeView === "postmatch") {
    return (
      <PostMatchRatingFlow
        matchId={mockMatch.id}
        matchTitle={mockMatch.title}
        matchSubtitle={mockMatch.subtitle}
        players={allPlayers}
        onComplete={() => setActiveView("hub")}
        onClose={() => setActiveView("hub")}
      />
    );
  }

  if (activeView === "quickrate") {
    return (
      <QuickRateMode
        matchId={mockMatch.id}
        matchTitle={mockMatch.title}
        homeTeam={mockMatch.homeTeam}
        awayTeam={mockMatch.awayTeam}
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        onComplete={() => setActiveView("hub")}
        onClose={() => setActiveView("hub")}
      />
    );
  }

  if (activeView === "profile" && selectedPlayer) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3"
          onClick={() => setActiveView("hub")}
        >
          ← Back
        </Button>
        <PlayerSentimentProfile
          playerName={selectedPlayer.name}
          teamName={selectedPlayer.team}
          position={selectedPlayer.position}
          number={selectedPlayer.number}
          onRate={() => setActiveView("postmatch")}
        />
      </div>
    );
  }

  if (activeView === "awards") {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3"
          onClick={() => setActiveView("hub")}
        >
          ← Back
        </Button>
        <FanPulseAwards />
      </div>
    );
  }

  if (activeView === "showdown") {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3"
          onClick={() => setActiveView("hub")}
        >
          ← Back
        </Button>
        <SentimentShowdown />
      </div>
    );
  }

  // Main Hub
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-foreground flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Fan Player Ratings
        </h2>
        <p className="text-sm text-muted-foreground">
          Rate players based on your emotions and feelings
        </p>
      </div>

      {/* Rate Now CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-all border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
          onClick={() => setActiveView("postmatch")}
        >
          <div className="text-2xl mb-2">⚽</div>
          <h3 className="font-bold text-sm text-foreground">Post-Match Rating</h3>
          <p className="text-xs text-muted-foreground mt-1">Detailed player-by-player</p>
          <p className="text-[10px] text-muted-foreground mt-2">⏱️ ~2 min</p>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-all border-accent/30 bg-gradient-to-br from-accent/5 to-transparent"
          onClick={() => setActiveView("quickrate")}
        >
          <Zap className="w-6 h-6 text-accent mb-2" />
          <h3 className="font-bold text-sm text-foreground">Quick Rate</h3>
          <p className="text-xs text-muted-foreground mt-1">Tap emojis, done fast</p>
          <p className="text-[10px] text-muted-foreground mt-2">⏱️ ~30 sec</p>
        </Card>
      </div>

      {/* Latest Match - Live Rating */}
      <LiveMatchRating
        matchTitle="Man City 1-0 Arsenal"
        minute={67}
        players={homePlayers.slice(0, 5)}
      />

      {/* Top Rated Players */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          🔥 Top Rated Players
          <Badge variant="secondary" className="text-[10px]">This Week</Badge>
        </h3>
        <div className="space-y-2">
          {topPlayers.map((player, i) => (
            <motion.button
              key={i}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              onClick={() => {
                setSelectedPlayer({
                  name: player.name,
                  team: player.team,
                  position: player.pos,
                  number: player.num,
                });
                setActiveView("profile");
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">{getSentimentEmoji(player.sentiment)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{player.name}</p>
                <p className="text-xs text-muted-foreground">{player.team}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{player.sentiment}%</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Awards & Showdown */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => setActiveView("awards")}
        >
          <Trophy className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-bold text-sm text-foreground">Fan Awards</h3>
          <p className="text-xs text-muted-foreground mt-1">Season's best by sentiment</p>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => setActiveView("showdown")}
        >
          <Swords className="w-6 h-6 text-accent mb-2" />
          <h3 className="font-bold text-sm text-foreground">Showdown</h3>
          <p className="text-xs text-muted-foreground mt-1">Player vs Player vote</p>
        </Card>
      </div>
    </div>
  );
}
