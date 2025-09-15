import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Star, TrendingUp, Users } from "lucide-react";

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
    if (rating >= 9.0) return "text-green-600";
    if (rating >= 8.0) return "text-blue-600";
    if (rating >= 7.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9.0) return "bg-green-100 text-green-800";
    if (rating >= 8.0) return "bg-blue-100 text-blue-800";
    if (rating >= 7.0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-yellow-600" />
        <h2 className="text-2xl font-bold">Team of the Week</h2>
        <Badge variant="secondary">Fan-Driven Analytics</Badge>
      </div>

      <Tabs defaultValue="EPL" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {leagues.map((league) => (
            <TabsTrigger key={league.code} value={league.code}>
              {league.code}
            </TabsTrigger>
          ))}
        </TabsList>

        {leagues.map((league) => (
          <TabsContent key={league.code} value={league.code} className="space-y-6">
            {/* League Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{league.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total Votes: {league.teamOfWeek.totalFanVotes.toLocaleString()}</span>
                <span>Avg Rating: {league.teamOfWeek.averageRating}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team of the Week */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team of the Week ({league.teamOfWeek.formation})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {league.teamOfWeek.players.map((playerData, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {playerData.position}
                          </Badge>
                          <Badge className={getRatingBadge(playerData.player.rating)}>
                            {playerData.player.rating}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm truncate">
                          {playerData.player.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {playerData.player.team}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {playerData.player.keyStats}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span>👥 {(playerData.player.fanVotes / 1000).toFixed(0)}k</span>
                          <span>🐦 {(playerData.player.tweetMentions / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Player and Goal of the Week */}
              <div className="space-y-6">
                {/* Player of the Week */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Player of the Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg">{league.playerOfWeek.name}</h4>
                        <Badge className={getRatingBadge(league.playerOfWeek.rating)}>
                          {league.playerOfWeek.rating}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {league.playerOfWeek.team} • {league.playerOfWeek.position}
                      </p>
                      <p className="text-sm font-medium">{league.playerOfWeek.keyStats}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Fan Votes</span>
                          <span>{league.playerOfWeek.fanVotes.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(league.playerOfWeek.fanVotes / 60000) * 100} 
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span>Tweet Mentions</span>
                          <span>{league.playerOfWeek.tweetMentions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal of the Week */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Goal of the Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold">{league.goalOfWeek.player}</h4>
                        <Badge variant="secondary">
                          {league.goalOfWeek.viralScore}% viral
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {league.goalOfWeek.team} vs {league.goalOfWeek.opponent}
                      </p>
                      <p className="text-sm">{league.goalOfWeek.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fan Votes</p>
                          <p className="font-semibold">{league.goalOfWeek.fanVotes.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Video Views</p>
                          <p className="font-semibold">{league.goalOfWeek.videoViews}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Trending #1</span>
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