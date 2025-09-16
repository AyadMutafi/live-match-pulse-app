import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Star, TrendingUp, Users, MessageCircle } from "lucide-react";
import { FieldFormation } from "./FieldFormation";

interface PlayerOfWeek {
  name: string;
  team: string;
  position: string;
  rating: number;
  fanVotes: number;
  keyStats: string;
  tweetMentions: number;
}

interface TeamOfWeek {
  formation: string;
  players: {
    position: string;
    player: PlayerOfWeek;
  }[];
  totalFanVotes: number;
  averageRating: number;
}

interface GoalOfWeek {
  player: string;
  team: string;
  opponent: string;
  description: string;
  fanVotes: number;
  viralScore: number;
  videoViews: string;
}

interface LeagueData {
  name: string;
  code: string;
  teamOfWeek: TeamOfWeek;
  goalOfWeek: GoalOfWeek;
  playerOfWeek: PlayerOfWeek;
}

export function TeamOfTheWeek() {
  // Mock data for field formation team of the week
  const fieldFormationTeam = [
    { id: "gk1", name: "Alisson Becker", position: "Goalkeeper", rating: 9.2, emoji: "🧤", team: "Liverpool", league: "Premier League", stats: { saves: 8, cleanSheets: 12 } },
    { id: "def1", name: "Virgil van Dijk", position: "Defender", rating: 9.0, emoji: "🛡️", team: "Liverpool", league: "Premier League", stats: { tackles: 45, passAccuracy: 91 } },
    { id: "def2", name: "Ruben Dias", position: "Defender", rating: 8.8, emoji: "🔒", team: "Man City", league: "Premier League", stats: { tackles: 38, cleanSheets: 10 } },
    { id: "def3", name: "Theo Hernandez", position: "Defender", rating: 8.7, emoji: "⚡", team: "AC Milan", league: "Serie A", stats: { assists: 6, tackles: 42 } },
    { id: "def4", name: "Dani Carvajal", position: "Defender", rating: 8.6, emoji: "🚀", team: "Real Madrid", league: "La Liga", stats: { assists: 4, tackles: 35 } },
    { id: "mid1", name: "Kevin De Bruyne", position: "Midfielder", rating: 9.4, emoji: "🎯", team: "Man City", league: "Premier League", stats: { assists: 15, goals: 8 } },
    { id: "mid2", name: "Luka Modric", position: "Midfielder", rating: 9.1, emoji: "🧙", team: "Real Madrid", league: "La Liga", stats: { assists: 7, passAccuracy: 94 } },
    { id: "mid3", name: "Pedri", position: "Midfielder", rating: 8.9, emoji: "💎", team: "Barcelona", league: "La Liga", stats: { assists: 6, passAccuracy: 89 } },
    { id: "for1", name: "Erling Haaland", position: "Forward", rating: 9.8, emoji: "🤖", team: "Man City", league: "Premier League", stats: { goals: 28, assists: 5 } },
    { id: "for2", name: "Kylian Mbappe", position: "Forward", rating: 9.6, emoji: "⚡", team: "Real Madrid", league: "La Liga", stats: { goals: 24, assists: 8 } },
    { id: "for3", name: "Mohamed Salah", position: "Forward", rating: 9.3, emoji: "👑", team: "Liverpool", league: "Premier League", stats: { goals: 22, assists: 12 } }
  ];

  const leagues: LeagueData[] = [
    {
      name: "Premier League",
      code: "EPL",
      teamOfWeek: {
        formation: "4-3-3",
        players: [
          { position: "GK", player: { name: "Alisson", team: "Liverpool", position: "GK", rating: 9.2, fanVotes: 45230, keyStats: "3 saves, 1 clean sheet", tweetMentions: 12450 } },
          { position: "RB", player: { name: "Alexander-Arnold", team: "Liverpool", position: "RB", rating: 8.8, fanVotes: 38920, keyStats: "2 assists, 89% pass acc", tweetMentions: 9870 } },
          { position: "CB", player: { name: "Van Dijk", team: "Liverpool", position: "CB", rating: 9.0, fanVotes: 42100, keyStats: "100% tackles, 1 goal", tweetMentions: 11230 } },
          { position: "CB", player: { name: "Saliba", team: "Arsenal", position: "CB", rating: 8.7, fanVotes: 35600, keyStats: "95% pass acc, 8 clearances", tweetMentions: 8940 } },
          { position: "LB", player: { name: "Shaw", team: "Man United", position: "LB", rating: 8.5, fanVotes: 29870, keyStats: "1 assist, 4 crosses", tweetMentions: 7650 } },
          { position: "CM", player: { name: "De Bruyne", team: "Man City", position: "CM", rating: 9.3, fanVotes: 48750, keyStats: "2 goals, 1 assist", tweetMentions: 15230 } },
          { position: "CM", player: { name: "Rice", team: "Arsenal", position: "CM", rating: 8.6, fanVotes: 33450, keyStats: "92% pass acc, 7 recoveries", tweetMentions: 8120 } },
          { position: "CM", player: { name: "Bellingham", team: "Real Madrid", position: "CM", rating: 9.1, fanVotes: 44320, keyStats: "1 goal, 2 key passes", tweetMentions: 13670 } },
          { position: "RW", player: { name: "Salah", team: "Liverpool", position: "RW", rating: 9.4, fanVotes: 52100, keyStats: "2 goals, 1 assist", tweetMentions: 18450 } },
          { position: "ST", player: { name: "Haaland", team: "Man City", position: "ST", rating: 9.5, fanVotes: 56780, keyStats: "Hat-trick, 100% shot acc", tweetMentions: 21340 } },
          { position: "LW", player: { name: "Rashford", team: "Man United", position: "LW", rating: 8.9, fanVotes: 41230, keyStats: "2 goals, 4 dribbles", tweetMentions: 12890 } }
        ],
        totalFanVotes: 468450,
        averageRating: 8.9
      },
      goalOfWeek: {
        player: "Erling Haaland",
        team: "Man City",
        opponent: "Chelsea",
        description: "Incredible bicycle kick from 18 yards after a perfectly weighted cross from De Bruyne",
        fanVotes: 89760,
        viralScore: 94,
        videoViews: "2.3M"
      },
      playerOfWeek: {
        name: "Erling Haaland",
        team: "Man City",
        position: "ST",
        rating: 9.5,
        fanVotes: 56780,
        keyStats: "Hat-trick vs Chelsea",
        tweetMentions: 21340
      }
    },
    {
      name: "La Liga",
      code: "LAL",
      teamOfWeek: {
        formation: "4-2-3-1",
        players: [
          { position: "GK", player: { name: "Ter Stegen", team: "Barcelona", position: "GK", rating: 8.9, fanVotes: 38920, keyStats: "5 saves, penalty save", tweetMentions: 10230 } },
          { position: "RB", player: { name: "Carvajal", team: "Real Madrid", position: "RB", rating: 8.6, fanVotes: 32450, keyStats: "1 assist, 3 crosses", tweetMentions: 7890 } },
          { position: "CB", player: { name: "Araujo", team: "Barcelona", position: "CB", rating: 8.8, fanVotes: 35670, keyStats: "100% duels, 1 goal", tweetMentions: 9120 } },
          { position: "CB", player: { name: "Rudiger", team: "Real Madrid", position: "CB", rating: 8.7, fanVotes: 33210, keyStats: "96% pass acc, 6 clearances", tweetMentions: 8450 } },
          { position: "LB", player: { name: "Balde", team: "Barcelona", position: "LB", rating: 8.5, fanVotes: 29800, keyStats: "2 assists, 5 dribbles", tweetMentions: 7230 } },
          { position: "CM", player: { name: "Pedri", team: "Barcelona", position: "CM", rating: 9.2, fanVotes: 44560, keyStats: "1 goal, 3 key passes", tweetMentions: 12890 } },
          { position: "CM", player: { name: "Modric", team: "Real Madrid", position: "CM", rating: 8.9, fanVotes: 40120, keyStats: "94% pass acc, 1 assist", tweetMentions: 11670 } },
          { position: "AM", player: { name: "Musiala", team: "Bayern Munich", position: "AM", rating: 9.0, fanVotes: 42340, keyStats: "2 assists, 7 dribbles", tweetMentions: 12110 } },
          { position: "RW", player: { name: "Yamal", team: "Barcelona", position: "RW", rating: 9.1, fanVotes: 46780, keyStats: "1 goal, 2 assists", tweetMentions: 15450 } },
          { position: "ST", player: { name: "Lewandowski", team: "Barcelona", position: "ST", rating: 9.4, fanVotes: 51230, keyStats: "2 goals vs Getafe", tweetMentions: 18670 } },
          { position: "LW", player: { name: "Vinicius Jr", team: "Real Madrid", position: "LW", rating: 9.3, fanVotes: 48950, keyStats: "2 goals, 4 dribbles", tweetMentions: 16890 } }
        ],
        totalFanVotes: 414030,
        averageRating: 8.9
      },
      goalOfWeek: {
        player: "Lamine Yamal",
        team: "Barcelona",
        opponent: "Real Sociedad",
        description: "Stunning curled shot from the edge of the box into the top corner, reminiscent of Messi's magic",
        fanVotes: 78450,
        viralScore: 91,
        videoViews: "1.9M"
      },
      playerOfWeek: {
        name: "Robert Lewandowski",
        team: "Barcelona",
        position: "ST",
        rating: 9.4,
        fanVotes: 51230,
        keyStats: "2 goals vs Getafe",
        tweetMentions: 18670
      }
    },
    {
      name: "Serie A",
      code: "SAA",
      teamOfWeek: {
        formation: "3-5-2",
        players: [
          { position: "GK", player: { name: "Maignan", team: "AC Milan", position: "GK", rating: 8.7, fanVotes: 34560, keyStats: "4 saves, clean sheet", tweetMentions: 8910 } },
          { position: "CB", player: { name: "Bastoni", team: "Inter", position: "CB", rating: 8.9, fanVotes: 38920, keyStats: "1 assist, 94% pass acc", tweetMentions: 10230 } },
          { position: "CB", player: { name: "Kim", team: "Napoli", position: "CB", rating: 8.6, fanVotes: 32450, keyStats: "100% tackles, 1 goal", tweetMentions: 8120 } },
          { position: "CB", player: { name: "Bremer", team: "Juventus", position: "CB", rating: 8.5, fanVotes: 30120, keyStats: "97% pass acc, 5 clearances", tweetMentions: 7450 } },
          { position: "RWB", player: { name: "Dumfries", team: "Inter", position: "RWB", rating: 8.8, fanVotes: 35670, keyStats: "2 assists, 6 crosses", tweetMentions: 9340 } },
          { position: "CM", player: { name: "Barella", team: "Inter", position: "CM", rating: 9.1, fanVotes: 42340, keyStats: "1 goal, 2 key passes", tweetMentions: 12110 } },
          { position: "CM", player: { name: "Tonali", team: "Newcastle", position: "CM", rating: 8.7, fanVotes: 33210, keyStats: "93% pass acc, 1 assist", tweetMentions: 8670 } },
          { position: "CM", player: { name: "McKennie", team: "Juventus", position: "CM", rating: 8.4, fanVotes: 28950, keyStats: "1 goal, 6 recoveries", tweetMentions: 7120 } },
          { position: "LWB", player: { name: "Dimarco", team: "Inter", position: "LWB", rating: 8.9, fanVotes: 38120, keyStats: "1 goal, 1 assist", tweetMentions: 10450 } },
          { position: "ST", player: { name: "Lautaro", team: "Inter", position: "ST", rating: 9.3, fanVotes: 46780, keyStats: "2 goals vs Milan", tweetMentions: 15230 } },
          { position: "ST", player: { name: "Osimhen", team: "Napoli", position: "ST", rating: 9.2, fanVotes: 44560, keyStats: "Hat-trick performance", tweetMentions: 14670 } }
        ],
        totalFanVotes: 375772,
        averageRating: 8.7
      },
      goalOfWeek: {
        player: "Lautaro Martinez",
        team: "Inter",
        opponent: "AC Milan",
        description: "Derby winner with a powerful header in the 89th minute that sent San Siro into chaos",
        fanVotes: 72340,
        viralScore: 88,
        videoViews: "1.6M"
      },
      playerOfWeek: {
        name: "Lautaro Martinez",
        team: "Inter",
        position: "ST",
        rating: 9.3,
        fanVotes: 46780,
        keyStats: "Derby winner vs Milan",
        tweetMentions: 15230
      }
    },
    {
      name: "UEFA Champions League",
      code: "UCL",
      teamOfWeek: {
        formation: "4-3-3",
        players: [
          { position: "GK", player: { name: "Courtois", team: "Real Madrid", position: "GK", rating: 9.1, fanVotes: 41230, keyStats: "7 saves vs Liverpool", tweetMentions: 11670 } },
          { position: "RB", player: { name: "Walker", team: "Man City", position: "RB", rating: 8.7, fanVotes: 34560, keyStats: "1 assist, pocket Mbappe", tweetMentions: 8910 } },
          { position: "CB", player: { name: "Dias", team: "Man City", position: "CB", rating: 8.9, fanVotes: 38120, keyStats: "100% duels won", tweetMentions: 10230 } },
          { position: "CB", player: { name: "Rudiger", team: "Real Madrid", position: "CB", rating: 8.8, fanVotes: 36450, keyStats: "95% pass acc, 1 goal", tweetMentions: 9670 } },
          { position: "LB", player: { name: "Robertson", team: "Liverpool", position: "LB", rating: 8.6, fanVotes: 32890, keyStats: "2 assists vs PSG", tweetMentions: 8450 } },
          { position: "CM", player: { name: "Modric", team: "Real Madrid", position: "CM", rating: 9.2, fanVotes: 44560, keyStats: "Master class vs Liverpool", tweetMentions: 13230 } },
          { position: "CM", player: { name: "Rodri", team: "Man City", position: "CM", rating: 9.0, fanVotes: 40120, keyStats: "96% pass acc, 1 goal", tweetMentions: 11890 } },
          { position: "CM", player: { name: "Bellingham", team: "Real Madrid", position: "CM", rating: 9.3, fanVotes: 47890, keyStats: "2 goals vs Liverpool", tweetMentions: 15670 } },
          { position: "RW", player: { name: "Salah", team: "Liverpool", position: "RW", rating: 8.8, fanVotes: 38920, keyStats: "1 goal, 1 assist vs PSG", tweetMentions: 12110 } },
          { position: "ST", player: { name: "Benzema", team: "Al Ittihad", position: "ST", rating: 9.4, fanVotes: 51230, keyStats: "Hat-trick in UCL return", tweetMentions: 18450 } },
          { position: "LW", player: { name: "Vinicius Jr", team: "Real Madrid", position: "LW", rating: 9.1, fanVotes: 43670, keyStats: "2 goals vs Liverpool", tweetMentions: 14890 } }
        ],
        totalFanVotes: 449541,
        averageRating: 9.0
      },
      goalOfWeek: {
        player: "Jude Bellingham",
        team: "Real Madrid",
        opponent: "Liverpool",
        description: "90th-minute winner at Anfield with a perfectly placed shot after a mazy run through Liverpool's defense",
        fanVotes: 95670,
        viralScore: 97,
        videoViews: "3.1M"
      },
      playerOfWeek: {
        name: "Jude Bellingham",
        team: "Real Madrid",
        position: "CM",
        rating: 9.3,
        fanVotes: 47890,
        keyStats: "90th min winner at Anfield",
        tweetMentions: 15670
      }
    },
    {
      name: "Europa League",
      code: "EL",
      teamOfWeek: {
        formation: "4-3-3",
        players: [
          { position: "GK", player: { name: "Simon", team: "Athletic Bilbao", position: "GK", rating: 8.6, fanVotes: 32450, keyStats: "5 saves vs Roma", tweetMentions: 8120 } },
          { position: "RB", player: { name: "Hakimi", team: "PSG", position: "RB", rating: 8.8, fanVotes: 36780, keyStats: "2 assists, pocket winger", tweetMentions: 9670 } },
          { position: "CB", player: { name: "Marquinhos", team: "PSG", position: "CB", rating: 8.7, fanVotes: 34560, keyStats: "100% duels, 1 goal", tweetMentions: 9120 } },
          { position: "CB", player: { name: "Smalling", team: "Roma", position: "CB", rating: 8.5, fanVotes: 30120, keyStats: "95% pass acc, clean sheet", tweetMentions: 7890 } },
          { position: "LB", player: { name: "Spinazzola", team: "Roma", position: "LB", rating: 8.4, fanVotes: 28670, keyStats: "1 assist, 4 crosses", tweetMentions: 7450 } },
          { position: "CM", player: { name: "Verratti", team: "PSG", position: "CM", rating: 8.9, fanVotes: 38920, keyStats: "94% pass acc, 2 key passes", tweetMentions: 10450 } },
          { position: "CM", player: { name: "Pellegrini", team: "Roma", position: "CM", rating: 8.6, fanVotes: 33210, keyStats: "1 goal, captain's display", tweetMentions: 8670 } },
          { position: "CM", player: { name: "Muani", team: "PSG", position: "CM", rating: 8.8, fanVotes: 35670, keyStats: "1 assist, 7 recoveries", tweetMentions: 9230 } },
          { position: "RW", player: { name: "Williams", team: "Athletic Bilbao", position: "RW", rating: 9.0, fanVotes: 40230, keyStats: "2 goals vs Roma", tweetMentions: 11890 } },
          { position: "ST", player: { name: "Mbappe", team: "PSG", position: "ST", rating: 9.2, fanVotes: 46780, keyStats: "Hat-trick in Europa", tweetMentions: 15230 } },
          { position: "LW", player: { name: "Abraham", team: "Roma", position: "LW", rating: 8.7, fanVotes: 34890, keyStats: "2 goals, work rate", tweetMentions: 9670 } }
        ],
        totalFanVotes: 362283,
        averageRating: 8.7
      },
      goalOfWeek: {
        player: "Nico Williams",
        team: "Athletic Bilbao",
        opponent: "Roma",
        description: "Lightning-fast counter-attack goal with a delightful chip over the goalkeeper after beating 3 defenders",
        fanVotes: 67890,
        viralScore: 86,
        videoViews: "1.4M"
      },
      playerOfWeek: {
        name: "Kylian Mbappe",
        team: "PSG",
        position: "ST",
        rating: 9.2,
        fanVotes: 46780,
        keyStats: "Hat-trick in Europa League",
        tweetMentions: 15230
      }
    },
    {
      name: "Conference League",
      code: "CL",
      teamOfWeek: {
        formation: "4-4-2",
        players: [
          { position: "GK", player: { name: "Onana", team: "Lille", position: "GK", rating: 8.4, fanVotes: 28950, keyStats: "4 saves, penalty save", tweetMentions: 7450 } },
          { position: "RB", player: { name: "Kristensen", team: "Leeds", position: "RB", rating: 8.3, fanVotes: 27120, keyStats: "1 assist, solid defending", tweetMentions: 6890 } },
          { position: "CB", player: { name: "Andersen", team: "Crystal Palace", position: "CB", rating: 8.5, fanVotes: 30230, keyStats: "100% aerial duels won", tweetMentions: 7670 } },
          { position: "CB", player: { name: "Vitik", team: "Slavia Prague", position: "CB", rating: 8.2, fanVotes: 25670, keyStats: "96% pass acc, 1 goal", tweetMentions: 6450 } },
          { position: "LB", player: { name: "Mykolenko", team: "Everton", position: "LB", rating: 8.1, fanVotes: 24560, keyStats: "2 assists, 5 crosses", tweetMentions: 6120 } },
          { position: "RM", player: { name: "Harrison", team: "Leeds", position: "RM", rating: 8.6, fanVotes: 32450, keyStats: "1 goal, 2 key passes", tweetMentions: 8120 } },
          { position: "CM", player: { name: "Doucoure", team: "Everton", position: "CM", rating: 8.4, fanVotes: 29120, keyStats: "93% pass acc, 1 assist", tweetMentions: 7230 } },
          { position: "CM", player: { name: "Krejci", team: "Slavia Prague", position: "CM", rating: 8.3, fanVotes: 27890, keyStats: "2 assists, box-to-box", tweetMentions: 6780 } },
          { position: "LM", player: { name: "Zaha", team: "Crystal Palace", position: "LM", rating: 8.7, fanVotes: 34560, keyStats: "2 goals, 4 dribbles", tweetMentions: 8910 } },
          { position: "ST", player: { name: "David", team: "Lille", position: "ST", rating: 8.8, fanVotes: 36120, keyStats: "Hat-trick vs Everton", tweetMentions: 9450 } },
          { position: "ST", player: { name: "Bamford", team: "Leeds", position: "ST", rating: 8.5, fanVotes: 31230, keyStats: "2 goals comeback hero", tweetMentions: 8010 } }
        ],
        totalFanVotes: 327893,
        averageRating: 8.4
      },
      goalOfWeek: {
        player: "Jonathan David",
        team: "Lille",
        opponent: "Everton",
        description: "Exquisite volley from outside the box that found the top corner with perfect technique",
        fanVotes: 54320,
        viralScore: 79,
        videoViews: "890K"
      },
      playerOfWeek: {
        name: "Jonathan David",
        team: "Lille",
        position: "ST",
        rating: 8.8,
        fanVotes: 36120,
        keyStats: "Hat-trick vs Everton",
        tweetMentions: 9450
      }
    },
    {
      name: "Saudi Pro League",
      code: "SPL",
      teamOfWeek: {
        formation: "4-2-3-1",
        players: [
          { position: "GK", player: { name: "Bono", team: "Al Hilal", position: "GK", rating: 8.8, fanVotes: 35670, keyStats: "6 saves, clean sheet", tweetMentions: 9230 } },
          { position: "RB", player: { name: "Cancelo", team: "Al Hilal", position: "RB", rating: 8.6, fanVotes: 32450, keyStats: "2 assists vs Al Nassr", tweetMentions: 8120 } },
          { position: "CB", player: { name: "Koulibaly", team: "Al Hilal", position: "CB", rating: 8.9, fanVotes: 38920, keyStats: "100% aerial duels", tweetMentions: 10450 } },
          { position: "CB", player: { name: "Ramos", team: "PSG", position: "CB", rating: 8.7, fanVotes: 34560, keyStats: "1 goal, leadership", tweetMentions: 9120 } },
          { position: "LB", player: { name: "Alex Telles", team: "Al Nassr", position: "LB", rating: 8.4, fanVotes: 28950, keyStats: "1 assist, 4 crosses", tweetMentions: 7450 } },
          { position: "CM", player: { name: "Fabinho", team: "Al Ittihad", position: "CM", rating: 8.8, fanVotes: 36120, keyStats: "93% pass acc, 1 goal", tweetMentions: 9670 } },
          { position: "CM", player: { name: "Neves", team: "Al Hilal", position: "CM", rating: 9.0, fanVotes: 40230, keyStats: "2 assists, masterclass", tweetMentions: 11890 } },
          { position: "AM", player: { name: "Mahrez", team: "Al Ahli", position: "AM", rating: 8.9, fanVotes: 38450, keyStats: "1 goal, 3 key passes", tweetMentions: 10670 } },
          { position: "RW", player: { name: "Al Dawsari", team: "Al Hilal", position: "RW", rating: 8.7, fanVotes: 33890, keyStats: "2 assists vs Al Nassr", tweetMentions: 8890 } },
          { position: "ST", player: { name: "Cristiano", team: "Al Nassr", position: "ST", rating: 9.5, fanVotes: 58760, keyStats: "Hat-trick vs Al Ahli", tweetMentions: 22340 } },
          { position: "LW", player: { name: "Neymar", team: "Al Hilal", position: "LW", rating: 9.2, fanVotes: 47890, keyStats: "2 goals, return from injury", tweetMentions: 18230 } }
        ],
        totalFanVotes: 434787,
        averageRating: 8.8
      },
      goalOfWeek: {
        player: "Cristiano Ronaldo",
        team: "Al Nassr",
        opponent: "Al Ahli",
        description: "Signature free-kick from 25 yards that dipped perfectly into the top corner, vintage CR7",
        fanVotes: 87650,
        viralScore: 95,
        videoViews: "2.8M"
      },
      playerOfWeek: {
        name: "Cristiano Ronaldo",
        team: "Al Nassr",
        position: "ST",
        rating: 9.5,
        fanVotes: 58760,
        keyStats: "Hat-trick vs Al Ahli",
        tweetMentions: 22340
      }
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 9.0) return "text-success";
    if (rating >= 8.0) return "text-primary";
    if (rating >= 7.0) return "text-warning";
    return "text-destructive";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9.0) return "bg-success/10 text-success border-success/20";
    if (rating >= 8.0) return "bg-primary/10 text-primary border-primary/20";
    if (rating >= 7.0) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getViralBadge = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    if (score >= 70) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-xl">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Team of the Week
            </h1>
            <p className="text-muted-foreground">Powered by Fan Sentiment & Social Analytics</p>
          </div>
        </div>

        {/* Field Formation */}
        <FieldFormation teamOfWeek={fieldFormationTeam} formation="4-3-3" />
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <TrendingUp className="w-4 h-4 mr-1" />
            Live Social Data
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Users className="w-4 h-4 mr-1" />
            Fan Voting Active
          </Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Target className="w-4 h-4 mr-1" />
            Real-time Analytics
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="EPL" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 backdrop-blur">
          {leagues.map((league) => (
            <TabsTrigger 
              key={league.code} 
              value={league.code}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              {league.code}
            </TabsTrigger>
          ))}
        </TabsList>

        {leagues.map((league) => (
          <TabsContent key={league.code} value={league.code} className="space-y-8 animate-fade-in">
            {/* Enhanced League Header */}
            <div className="bg-gradient-to-r from-card via-muted/50 to-card p-6 rounded-xl border border-border/50 backdrop-blur">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{league.name}</h3>
                  <p className="text-muted-foreground">Fan-voted selections based on social sentiment</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{league.teamOfWeek.totalFanVotes.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{league.teamOfWeek.averageRating}</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{league.teamOfWeek.formation}</div>
                    <div className="text-xs text-muted-foreground">Formation</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Enhanced Team of the Week */}
              <Card className="xl:col-span-2 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div>Team of the Week</div>
                      <div className="text-sm font-normal text-muted-foreground">Formation: {league.teamOfWeek.formation}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {league.teamOfWeek.players.map((playerData, index) => (
                      <div
                        key={index}
                        className="group p-4 bg-gradient-to-br from-card to-muted/30 border border-border/50 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs font-medium bg-primary/5 border-primary/20">
                            {playerData.position}
                          </Badge>
                          <Badge className={`${getRatingBadge(playerData.player.rating)} text-xs font-bold`}>
                            ⭐ {playerData.player.rating}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {playerData.player.name}
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium">
                            {playerData.player.team}
                          </p>
                          <p className="text-xs text-accent line-clamp-2">
                            {playerData.player.keyStats}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="w-3 h-3 text-primary" />
                            <span className="font-medium">{(playerData.player.fanVotes / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MessageCircle className="w-3 h-3 text-accent" />
                            <span className="font-medium">{(playerData.player.tweetMentions / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                        <Progress 
                          value={(playerData.player.fanVotes / Math.max(...league.teamOfWeek.players.map(p => p.player.fanVotes))) * 100}
                          className="h-1.5 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Player and Goal Highlights */}
              <div className="space-y-6">
                {/* Enhanced Player of the Week */}
                <Card className="bg-gradient-to-br from-success/5 via-card to-primary/5 border-success/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-success/10 to-primary/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-success/20 rounded-lg">
                        <Star className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <div className="text-lg">Player of the Week</div>
                        <div className="text-sm font-normal text-muted-foreground">Fan Favorite Champion</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-br from-success/10 to-primary/10 rounded-xl">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-foreground">{league.playerOfWeek.name}</h4>
                          <Badge className={`${getRatingBadge(league.playerOfWeek.rating)} text-sm font-bold`}>
                            🏆 {league.playerOfWeek.rating}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {league.playerOfWeek.team} • {league.playerOfWeek.position}
                        </p>
                        <p className="text-sm font-semibold text-accent mt-2">{league.playerOfWeek.keyStats}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">{league.playerOfWeek.fanVotes.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Fan Votes</div>
                          <Progress 
                            value={(league.playerOfWeek.fanVotes / 60000) * 100} 
                            className="h-2 mt-2"
                          />
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-secondary">{league.playerOfWeek.tweetMentions.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Social Mentions</div>
                          <Progress 
                            value={(league.playerOfWeek.tweetMentions / 25000) * 100} 
                            className="h-2 mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Goal of the Week */}
                <Card className="bg-gradient-to-br from-accent/5 via-card to-secondary/5 border-accent/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Target className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-lg">Goal of the Week</div>
                        <div className="text-sm font-normal text-muted-foreground">Most Viral Moment</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-foreground">{league.goalOfWeek.player}</h4>
                          <Badge className={`${getViralBadge(league.goalOfWeek.viralScore)} text-sm font-bold border-0`}>
                            🔥 {league.goalOfWeek.viralScore}% Viral
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {league.goalOfWeek.team} vs {league.goalOfWeek.opponent}
                        </p>
                        <p className="text-sm text-foreground mt-2 italic">"{league.goalOfWeek.description}"</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-accent">{league.goalOfWeek.fanVotes.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Fan Votes</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-secondary">{league.goalOfWeek.videoViews}</div>
                          <div className="text-xs text-muted-foreground">Video Views</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 p-3 bg-success/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <span className="text-sm font-semibold text-success">Trending #1 Worldwide</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}