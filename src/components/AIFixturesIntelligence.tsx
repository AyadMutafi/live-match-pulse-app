import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Target,
  Users,
  Clock,
  Globe,
  Zap
} from "lucide-react";

interface TeamForm {
  teamName: string;
  teamLogo?: string;
  teamColor: string;
  overallForm: number;
  recentResults: string[];
  keyPlayers: {
    name: string;
    position: string;
    formRating: number;
    injuryStatus?: string;
  }[];
  tacticalSetup: {
    formation: string;
    style: string;
    effectiveness: number;
  };
  strengths: string[];
  concerns: string[];
}

interface AIFixture {
  id: string;
  homeTeam: TeamForm;
  awayTeam: TeamForm;
  competition: string;
  matchDate: string;
  venue: string;
  kickoffTime: string;
  aiPrediction: {
    homeWin: number;
    draw: number;
    awayWin: number;
    confidence: number;
  };
  keyBattles: {
    battle: string;
    homeAdvantage: number;
    description: string;
  }[];
  expertInsights: {
    source: string;
    quote: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  socialBuzz: {
    totalMentions: number;
    sentiment: "positive" | "negative" | "neutral";
    trendingHashtags: string[];
  };
  webSourcesAnalyzed: number;
  analysisConfidence: number;
}

interface Competition {
  name: string;
  code: string;
  fixtures: AIFixture[];
}

export function AIFixturesIntelligence() {
  const competitions: Competition[] = [
    {
      name: "Premier League",
      code: "EPL",
      fixtures: [
        {
          id: "mci_vs_ars_2024",
          homeTeam: {
            teamName: "Manchester City",
            teamColor: "#6CABDD",
            overallForm: 87,
            recentResults: ["W", "W", "D", "W", "W"],
            keyPlayers: [
              { name: "Erling Haaland", position: "ST", formRating: 94 },
              { name: "Kevin De Bruyne", position: "CAM", formRating: 91 },
              { name: "Rodri", position: "CDM", formRating: 89 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "Possession-based attacking", effectiveness: 92 },
            strengths: ["Home dominance", "Squad depth", "Big-game experience"],
            concerns: ["Defensive injuries", "Away form inconsistency"]
          },
          awayTeam: {
            teamName: "Arsenal", 
            teamColor: "#EF0107",
            overallForm: 83,
            recentResults: ["W", "L", "W", "W", "D"],
            keyPlayers: [
              { name: "Bukayo Saka", position: "RW", formRating: 88, injuryStatus: "Minor knock" },
              { name: "Martin Ødegaard", position: "CAM", formRating: 86 },
              { name: "William Saliba", position: "CB", formRating: 85 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "High-pressing counter-attack", effectiveness: 84 },
            strengths: ["Youth energy", "Set-piece threat", "Counter-attacking"],
            concerns: ["Saka injury doubt", "Etihad record", "Mental pressure"]
          },
          competition: "Premier League",
          matchDate: "2024-03-31",
          venue: "Etihad Stadium",
          kickoffTime: "16:30",
          aiPrediction: { homeWin: 58, draw: 25, awayWin: 17, confidence: 82 },
          keyBattles: [
            { battle: "Haaland vs Saliba", homeAdvantage: 65, description: "Striker's pace vs defender's positioning" },
            { battle: "De Bruyne vs Rice", homeAdvantage: 72, description: "Creative genius vs defensive shield" }
          ],
          expertInsights: [
            { source: "Sky Sports", quote: "City's home fortress meets Arsenal's title ambitions", sentiment: "neutral" },
            { source: "BBC Sport", quote: "Haaland's form could be decisive in this title race clash", sentiment: "positive" }
          ],
          socialBuzz: { totalMentions: 89420, sentiment: "positive", trendingHashtags: ["MCIARS", "TitleRace", "Haaland"] },
          webSourcesAnalyzed: 127,
          analysisConfidence: 89
        }
      ]
    },
    {
      name: "La Liga",
      code: "LAL", 
      fixtures: [
        {
          id: "fcb_vs_atm_2024",
          homeTeam: {
            teamName: "FC Barcelona",
            teamColor: "#A50044",
            overallForm: 91,
            recentResults: ["W", "W", "W", "D", "W"],
            keyPlayers: [
              { name: "Robert Lewandowski", position: "ST", formRating: 93 },
              { name: "Pedri", position: "CM", formRating: 89 },
              { name: "Lamine Yamal", position: "RW", formRating: 87 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "Tiki-taka possession", effectiveness: 94 },
            strengths: ["Camp Nou atmosphere", "Attack fluidity", "Youth integration"],
            concerns: ["Defensive depth", "European fatigue"]
          },
          awayTeam: {
            teamName: "Atlético Madrid",
            teamColor: "#CB3524",
            overallForm: 76,
            recentResults: ["D", "W", "L", "W", "D"],
            keyPlayers: [
              { name: "Antoine Griezmann", position: "CAM", formRating: 84 },
              { name: "José Giménez", position: "CB", formRating: 82 },
              { name: "Koke", position: "CM", formRating: 80 }
            ],
            tacticalSetup: { formation: "3-5-2", style: "Defensive counter-attack", effectiveness: 78 },
            strengths: ["Defensive organization", "Counter-attack threat", "Big-match experience"],
            concerns: ["Away scoring record", "Squad rotation limitations"]
          },
          competition: "La Liga",
          matchDate: "2024-04-21",
          venue: "Camp Nou",
          kickoffTime: "21:00",
          aiPrediction: { homeWin: 68, draw: 22, awayWin: 10, confidence: 85 },
          keyBattles: [
            { battle: "Lewandowski vs Giménez", homeAdvantage: 78, description: "Clinical finisher vs defensive wall" },
            { battle: "Pedri vs Koke", homeAdvantage: 62, description: "Youth vs experience in midfield" }
          ],
          expertInsights: [
            { source: "Marca", quote: "Barcelona's attacking flow faces Atlético's defensive steel", sentiment: "neutral" },
            { source: "AS", quote: "Camp Nou could be decisive for Barça's title push", sentiment: "positive" }
          ],
          socialBuzz: { totalMentions: 67230, sentiment: "positive", trendingHashtags: ["FCBAtleti", "CampNou", "LaLiga"] },
          webSourcesAnalyzed: 94,
          analysisConfidence: 87
        }
      ]
    },
    {
      name: "Serie A",
      code: "SAA",
      fixtures: [
        {
          id: "int_vs_juv_2024",
          homeTeam: {
            teamName: "Inter Milan",
            teamColor: "#0F4C96",
            overallForm: 84,
            recentResults: ["W", "W", "D", "W", "L"],
            keyPlayers: [
              { name: "Lautaro Martínez", position: "ST", formRating: 91 },
              { name: "Nicolò Barella", position: "CM", formRating: 88 },
              { name: "Alessandro Bastoni", position: "CB", formRating: 86 }
            ],
            tacticalSetup: { formation: "3-5-2", style: "Balanced possession", effectiveness: 87 },
            strengths: ["San Siro advantage", "Tactical flexibility", "Derby experience"],
            concerns: ["European fatigue", "Squad rotation needs"]
          },
          awayTeam: {
            teamName: "Juventus",
            teamColor: "#000000",
            overallForm: 79,
            recentResults: ["D", "W", "W", "D", "L"],
            keyPlayers: [
              { name: "Dušan Vlahović", position: "ST", formRating: 85 },
              { name: "Federico Chiesa", position: "RW", formRating: 83 },
              { name: "Manuel Locatelli", position: "CM", formRating: 81 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "Defensive solidity", effectiveness: 82 },
            strengths: ["Defensive discipline", "Counter-attack speed", "Mental strength"],
            concerns: ["Away scoring issues", "Midfield creativity", "Injury list"]
          },
          competition: "Serie A",
          matchDate: "2024-04-07",
          venue: "San Siro",
          kickoffTime: "20:45",
          aiPrediction: { homeWin: 52, draw: 31, awayWin: 17, confidence: 74 },
          keyBattles: [
            { battle: "Lautaro vs Bremer", homeAdvantage: 68, description: "Argentine's movement vs Brazilian's physicality" },
            { battle: "Barella vs Locatelli", homeAdvantage: 55, description: "Italy midfield battle for tempo control" }
          ],
          expertInsights: [
            { source: "Gazzetta", quote: "Derby d'Italia promises tactical masterclass at San Siro", sentiment: "neutral" },
            { source: "Corriere", quote: "Inter's home record gives them psychological edge", sentiment: "positive" }
          ],
          socialBuzz: { totalMentions: 54780, sentiment: "neutral", trendingHashtags: ["DerbyItalia", "InterJuve", "SerieA"] },
          webSourcesAnalyzed: 78,
          analysisConfidence: 81
        }
      ]
    },
    {
      name: "UEFA Champions League",
      code: "UCL",
      fixtures: [
        {
          id: "rm_vs_mci_2024",
          homeTeam: {
            teamName: "Real Madrid",
            teamColor: "#FEBE10",
            overallForm: 93,
            recentResults: ["W", "W", "W", "D", "W"],
            keyPlayers: [
              { name: "Jude Bellingham", position: "CAM", formRating: 96 },
              { name: "Vinícius Jr.", position: "LW", formRating: 94 },
              { name: "Luka Modrić", position: "CM", formRating: 89 }
            ],
            tacticalSetup: { formation: "4-3-1-2", style: "Counter-attacking precision", effectiveness: 95 },
            strengths: ["Bernabéu magic", "Champions League experience", "Clutch mentality"],
            concerns: ["Defensive pace", "Squad depth"]
          },
          awayTeam: {
            teamName: "Manchester City",
            teamColor: "#6CABDD",
            overallForm: 88,
            recentResults: ["W", "D", "W", "W", "L"],
            keyPlayers: [
              { name: "Erling Haaland", position: "ST", formRating: 92 },
              { name: "Kevin De Bruyne", position: "CAM", formRating: 90 },
              { name: "Rúben Dias", position: "CB", formRating: 87 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "High-press possession", effectiveness: 91 },
            strengths: ["Technical superiority", "Squad depth", "Pep's tactics"],
            concerns: ["Bernabéu pressure", "Champions League history"]
          },
          competition: "UEFA Champions League",
          matchDate: "2024-05-01",
          venue: "Santiago Bernabéu",
          kickoffTime: "21:00",
          aiPrediction: { homeWin: 48, draw: 28, awayWin: 24, confidence: 76 },
          keyBattles: [
            { battle: "Bellingham vs Rodri", homeAdvantage: 58, description: "Young genius vs experienced anchor" },
            { battle: "Vinícius vs Walker", homeAdvantage: 72, description: "Brazilian flair vs English physicality" }
          ],
          expertInsights: [
            { source: "UEFA.com", quote: "Bernabéu atmosphere could be decisive in this heavyweight clash", sentiment: "positive" },
            { source: "ESPN", quote: "Tactical chess match between Ancelotti and Guardiola", sentiment: "neutral" }
          ],
          socialBuzz: { totalMentions: 156890, sentiment: "positive", trendingHashtags: ["UCL", "RealMadrid", "ManCity", "ChampionsLeague"] },
          webSourcesAnalyzed: 203,
          analysisConfidence: 92
        }
      ]
    },
    {
      name: "Saudi Pro League",
      code: "SPL",
      fixtures: [
        {
          id: "alh_vs_aln_2024",
          homeTeam: {
            teamName: "Al Hilal",
            teamColor: "#005494",
            overallForm: 89,
            recentResults: ["W", "W", "W", "D", "W"],
            keyPlayers: [
              { name: "Neymar Jr.", position: "LW", formRating: 92, injuryStatus: "Returning from injury" },
              { name: "Rúben Neves", position: "CM", formRating: 88 },
              { name: "Kalidou Koulibaly", position: "CB", formRating: 85 }
            ],
            tacticalSetup: { formation: "4-2-3-1", style: "Technical possession", effectiveness: 91 },
            strengths: ["Star quality", "Home support", "Technical ability"],
            concerns: ["Neymar fitness", "Defensive consistency"]
          },
          awayTeam: {
            teamName: "Al Nassr",
            teamColor: "#FFDB00",
            overallForm: 86,
            recentResults: ["W", "W", "L", "W", "D"],
            keyPlayers: [
              { name: "Cristiano Ronaldo", position: "ST", formRating: 90 },
              { name: "Sadio Mané", position: "LW", formRating: 84 },
              { name: "Aymeric Laporte", position: "CB", formRating: 82 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "Direct attacking", effectiveness: 86 },
            strengths: ["Ronaldo factor", "Counter-attack pace", "Mental resilience"],
            concerns: ["Away form", "Midfield control", "Defensive transitions"]
          },
          competition: "Saudi Pro League",
          matchDate: "2024-04-12",
          venue: "Kingdom Arena",
          kickoffTime: "20:00",
          aiPrediction: { homeWin: 55, draw: 27, awayWin: 18, confidence: 79 },
          keyBattles: [
            { battle: "Neymar vs Laporte", homeAdvantage: 68, description: "Brazilian creativity vs Spanish solidity" },
            { battle: "Cristiano vs Koulibaly", homeAdvantage: 45, description: "Portuguese legend vs Senegalese wall" }
          ],
          expertInsights: [
            { source: "Saudi Sport", quote: "Neymar's return adds new dimension to Al Hilal's attack", sentiment: "positive" },
            { source: "Gulf News", quote: "Cristiano needs to deliver in this crucial derby", sentiment: "neutral" }
          ],
          socialBuzz: { totalMentions: 234560, sentiment: "positive", trendingHashtags: ["الهلال_النصر", "Neymar", "Cristiano", "SPL"] },
          webSourcesAnalyzed: 89,
          analysisConfidence: 84
        }
      ]
    },
    {
      name: "UEFA Europa League", 
      code: "UEL",
      fixtures: [
        {
          id: "liv_vs_ata_2024",
          homeTeam: {
            teamName: "Liverpool",
            teamColor: "#C8102E",
            overallForm: 85,
            recentResults: ["W", "D", "W", "L", "W"],
            keyPlayers: [
              { name: "Mohamed Salah", position: "RW", formRating: 91 },
              { name: "Virgil van Dijk", position: "CB", formRating: 87 },
              { name: "Alexis Mac Allister", position: "CM", formRating: 84 }
            ],
            tacticalSetup: { formation: "4-3-3", style: "High-intensity pressing", effectiveness: 88 },
            strengths: ["Anfield atmosphere", "European pedigree", "Squad experience"],
            concerns: ["Squad rotation fatigue", "Defensive injuries"]
          },
          awayTeam: {
            teamName: "Atalanta",
            teamColor: "#1E2328",
            overallForm: 81,
            recentResults: ["W", "W", "D", "L", "W"],
            keyPlayers: [
              { name: "Ademola Lookman", position: "LW", formRating: 86 },
              { name: "Teun Koopmeiners", position: "CM", formRating: 83 },
              { name: "Giorgio Scalvini", position: "CB", formRating: 80 }
            ],
            tacticalSetup: { formation: "3-4-1-2", style: "High-energy attacking", effectiveness: 84 },
            strengths: ["Counter-press intensity", "Wing-back threat", "European form"],
            concerns: ["Away defensive record", "Squad depth", "Anfield intimidation"]
          },
          competition: "UEFA Europa League",
          matchDate: "2024-04-11",
          venue: "Anfield",
          kickoffTime: "20:00",
          aiPrediction: { homeWin: 61, draw: 23, awayWin: 16, confidence: 83 },
          keyBattles: [
            { battle: "Salah vs Scalvini", homeAdvantage: 75, description: "Egyptian king vs Italian prospect" },
            { battle: "Van Dijk vs Lookman", homeAdvantage: 68, description: "Defensive giant vs pacy winger" }
          ],
          expertInsights: [
            { source: "Liverpool Echo", quote: "Anfield European nights bring out the best in this Liverpool side", sentiment: "positive" },
            { source: "ESPN", quote: "Atalanta's intensity could trouble Liverpool's high line", sentiment: "neutral" }
          ],
          socialBuzz: { totalMentions: 78450, sentiment: "positive", trendingHashtags: ["YNWA", "EuropaLeague", "Atalanta"] },
          webSourcesAnalyzed: 112,
          analysisConfidence: 86
        }
      ]
    }
  ];

  const getFormColor = (rating: number) => {
    if (rating >= 85) return "text-success";
    if (rating >= 75) return "text-primary";
    if (rating >= 65) return "text-warning";
    return "text-destructive";
  };

  const getPredictionColor = (percentage: number, type: "home" | "draw" | "away") => {
    const colors = {
      home: percentage >= 50 ? "text-success" : percentage >= 30 ? "text-warning" : "text-muted-foreground",
      draw: percentage >= 30 ? "text-primary" : "text-muted-foreground", 
      away: percentage >= 50 ? "text-success" : percentage >= 30 ? "text-warning" : "text-muted-foreground"
    };
    return colors[type];
  };

  const renderFixture = (fixture: AIFixture) => (
    <Card key={fixture.id} className="bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{fixture.homeTeam.teamName} vs {fixture.awayTeam.teamName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              <Globe className="w-3 h-3 mr-1" />
              {fixture.webSourcesAnalyzed} sources
            </Badge>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {fixture.analysisConfidence}% confidence
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{fixture.matchDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{fixture.kickoffTime}</span>
          </div>
          <span>📍 {fixture.venue}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Team Forms Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {[fixture.homeTeam, fixture.awayTeam].map((team, index) => (
            <div key={team.teamName} className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: team.teamColor }}
                ></div>
                <h4 className="font-semibold">{team.teamName}</h4>
                <Badge className={`text-xs ${getFormColor(team.overallForm)} bg-muted/50`}>
                  {team.overallForm}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Recent Form</div>
                <div className="flex gap-1">
                  {team.recentResults.map((result, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-white ${
                        result === 'W' ? 'bg-success' : result === 'D' ? 'bg-warning' : 'bg-destructive'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Key Players</div>
                {team.keyPlayers.slice(0, 2).map((player, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-muted-foreground ml-1">({player.position})</span>
                      {player.injuryStatus && (
                        <Badge variant="outline" className="ml-1 text-xs bg-destructive/10 text-destructive">
                          {player.injuryStatus}
                        </Badge>
                      )}
                    </div>
                    <span className={`font-bold ${getFormColor(player.formRating)}`}>
                      {player.formRating}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Prediction */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">AI Match Prediction</span>
            <Badge variant="outline" className="text-xs">
              {fixture.aiPrediction.confidence}% confidence
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${getPredictionColor(fixture.aiPrediction.homeWin, 'home')}`}>
                {fixture.aiPrediction.homeWin}%
              </div>
              <div className="text-xs text-muted-foreground">Home Win</div>
              <Progress value={fixture.aiPrediction.homeWin} className="h-2 mt-1" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${getPredictionColor(fixture.aiPrediction.draw, 'draw')}`}>
                {fixture.aiPrediction.draw}%
              </div>
              <div className="text-xs text-muted-foreground">Draw</div>
              <Progress value={fixture.aiPrediction.draw} className="h-2 mt-1" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${getPredictionColor(fixture.aiPrediction.awayWin, 'away')}`}>
                {fixture.aiPrediction.awayWin}%
              </div>
              <div className="text-xs text-muted-foreground">Away Win</div>
              <Progress value={fixture.aiPrediction.awayWin} className="h-2 mt-1" />
            </div>
          </div>
        </div>

        {/* Key Battles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm">Key Battles</span>
          </div>
          {fixture.keyBattles.map((battle, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{battle.battle}</span>
                <Badge variant="outline" className="text-xs">
                  {battle.homeAdvantage}% home advantage
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{battle.description}</p>
              <Progress value={battle.homeAdvantage} className="h-1.5 mt-2" />
            </div>
          ))}
        </div>

        {/* Social Buzz & Expert Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="font-semibold text-sm">Social Buzz</span>
            </div>
            <div className="p-3 bg-success/5 rounded-lg">
              <div className="text-lg font-bold text-success">{fixture.socialBuzz.totalMentions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Social mentions</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {fixture.socialBuzz.trendingHashtags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-success/10 text-success">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span className="font-semibold text-sm">Expert Insights</span>
            </div>
            <div className="space-y-2 max-h-20 overflow-y-auto">
              {fixture.expertInsights.slice(0, 2).map((insight, i) => (
                <div key={i} className="p-2 bg-accent/5 rounded text-xs">
                  <p className="italic text-muted-foreground">"{insight.quote}"</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium text-accent">{insight.source}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      insight.sentiment === "positive" ? "bg-success" :
                      insight.sentiment === "negative" ? "bg-destructive" : "bg-warning"
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 rounded-xl">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-accent to-primary rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              AI Fixtures Intelligence
            </h1>
            <p className="text-muted-foreground">Advanced Pre-Match Analysis Across All Competitions</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Brain className="w-4 h-4 mr-1" />
            AI-Powered Analysis
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Globe className="w-4 h-4 mr-1" />
            Multi-Source Intelligence
          </Badge>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Clock className="w-4 h-4 mr-1" />
            Real-time Updates
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="EPL" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 backdrop-blur">
          {competitions.map((competition) => (
            <TabsTrigger 
              key={competition.code} 
              value={competition.code}
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-300"
            >
              {competition.code}
            </TabsTrigger>
          ))}
        </TabsList>

        {competitions.map((competition) => (
          <TabsContent key={competition.code} value={competition.code} className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-card via-muted/50 to-card p-4 rounded-xl border border-border/50">
              <h3 className="text-xl font-semibold text-center">{competition.name} - Upcoming Fixtures</h3>
              <p className="text-muted-foreground text-center text-sm">AI-powered analysis of key upcoming matches</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {competition.fixtures.map(renderFixture)}
            </div>

            {competition.fixtures.length === 0 && (
              <div className="text-center p-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming fixtures available for analysis</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}