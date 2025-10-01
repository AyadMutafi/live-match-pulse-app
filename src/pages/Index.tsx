import { useState } from "react";
import { LiveMatch } from "@/components/LiveMatch";
import { EnhancedPrediction } from "@/components/EnhancedPrediction";
import { SentimentMeter } from "@/components/SentimentMeter";
import { AIAnalytics } from "@/components/AIAnalytics";
import { BottomNavigation } from "@/components/BottomNavigation";
import { StatCard } from "@/components/StatCard";
import { TeamPulseRating } from "@/components/TeamPulseRating";
import { MultiLanguageSentiment } from "@/components/MultiLanguageSentiment";
import { MatchPulse } from "@/components/MatchPulse";
import { AIPreMatchAnalysis } from "@/components/AIPreMatchAnalysis";
import { TeamOfTheWeek } from "@/components/TeamOfTheWeek";
import { AIFixturesIntelligence } from "@/components/AIFixturesIntelligence";
import { FavoriteTeamsDashboard } from "@/components/FavoriteTeamsDashboard";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { PersonalizedFeed } from "@/components/PersonalizedFeed";
import { RealMatchDataLoader } from "@/components/RealMatchDataLoader";
import { RealMatchList } from "@/components/RealMatchList";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Users, Target, TrendingUp, MessageCircle, Brain, Heart } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for the Live Fan Pulse platform
  const liveMatches = [
    {
      homeTeam: { name: "Manchester City", logo: "", score: 2, color: "#6CABDD" },
      awayTeam: { name: "Tottenham", logo: "", score: 1, color: "#132257" },
      minute: 78,
      status: "LIVE",
      isLive: true
    },
    {
      homeTeam: { name: "Arsenal", logo: "", score: 1, color: "#EF0107" },
      awayTeam: { name: "Chelsea", logo: "", score: 1, color: "#034694" },
      minute: 45,
      status: "HT",
      isLive: false
    }
  ];

  const sentiment = {
    positive: 68,
    neutral: 22,
    negative: 10,
    totalMentions: 24673,
    trending: ["MCITOT", "Haaland", "Kane", "PremierLeague", "Pep"]
  };

  const aiAnalytics = {
    tweets: [
      {
        id: "1",
        text: "Haaland's form has been absolutely incredible this season! City looking unstoppable at home 🔥⚽",
        author: "FootballFan2024",
        engagement: 1240,
        sentiment: "positive" as const,
        influence_score: 85
      },
      {
        id: "2", 
        text: "Spurs defense looking shaky again. Need to step up big time against City's attack",
        author: "COYSForever",
        engagement: 892,
        sentiment: "negative" as const,
        influence_score: 67
      },
      {
        id: "3",
        text: "This should be a great tactical battle between Pep and Ange. Excited for kickoff! #MCITOT",
        author: "TacticsExpert",
        engagement: 2150,
        sentiment: "neutral" as const,
        influence_score: 92
      }
    ],
    keyInsights: [
      "Haaland sentiment is 89% positive, indicating strong fan confidence in his performance",
      "Tottenham's defensive concerns mentioned in 34% of negative posts",
      "Pep Guardiola's tactical approach generates 67% more engagement than average",
      "Home advantage sentiment for City is at season-high 78%"
    ],
    trendingTopics: [
      { topic: "Haaland", volume: 12400, sentiment: 89 },
      { topic: "MCITOT", volume: 8900, sentiment: 72 },
      { topic: "PepGuardiola", volume: 6700, sentiment: 81 },
      { topic: "Kane", volume: 5500, sentiment: 65 }
    ],
    influencerActivity: [
      { name: "GaryLineker", followers: 8500000, recent_posts: 3 },
      { name: "rioferdy5", followers: 4200000, recent_posts: 5 }
    ]
  };

  // Mock data for major European teams
  const majorTeams = [
    {
      teamName: "FC Barcelona",
      league: "La Liga - Spain",
      teamLogo: "",
      overallPulse: 87,
      totalMentions: 15420,
      languages: ["Spanish", "English", "Catalan", "French"],
      players: [
        { id: "1", name: "Robert Lewandowski", position: "Forward", rating: 9.2, pulseScore: 92, mentions: 3420, sentiment: "positive" as const },
        { id: "2", name: "Pedri", position: "Midfielder", rating: 8.8, pulseScore: 89, mentions: 2840, sentiment: "positive" as const },
        { id: "3", name: "Frenkie de Jong", position: "Midfielder", rating: 8.5, pulseScore: 82, mentions: 2180, sentiment: "neutral" as const },
        { id: "4", name: "Ronald Araujo", position: "Defender", rating: 8.3, pulseScore: 79, mentions: 1920, sentiment: "positive" as const },
        { id: "5", name: "Marc-André ter Stegen", position: "Goalkeeper", rating: 8.1, pulseScore: 76, mentions: 1580, sentiment: "neutral" as const }
      ]
    },
    {
      teamName: "Real Madrid",
      league: "La Liga - Spain", 
      teamLogo: "",
      overallPulse: 91,
      totalMentions: 18750,
      languages: ["Spanish", "English", "Portuguese", "French"],
      players: [
        { id: "1", name: "Vinícius Jr.", position: "Forward", rating: 9.4, pulseScore: 95, mentions: 4250, sentiment: "positive" as const },
        { id: "2", name: "Jude Bellingham", position: "Midfielder", rating: 9.1, pulseScore: 93, mentions: 3890, sentiment: "positive" as const },
        { id: "3", name: "Karim Benzema", position: "Forward", rating: 8.9, pulseScore: 88, mentions: 3420, sentiment: "positive" as const },
        { id: "4", name: "Luka Modric", position: "Midfielder", rating: 8.7, pulseScore: 85, mentions: 2950, sentiment: "neutral" as const },
        { id: "5", name: "Thibaut Courtois", position: "Goalkeeper", rating: 8.4, pulseScore: 81, mentions: 2240, sentiment: "positive" as const }
      ]
    },
    {
      teamName: "Manchester City",
      league: "Premier League - England",
      teamLogo: "",
      overallPulse: 84,
      totalMentions: 14280,
      languages: ["English", "Spanish", "Portuguese", "French"],
      players: [
        { id: "1", name: "Erling Haaland", position: "Forward", rating: 9.3, pulseScore: 94, mentions: 3820, sentiment: "positive" as const },
        { id: "2", name: "Kevin De Bruyne", position: "Midfielder", rating: 9.0, pulseScore: 91, mentions: 3140, sentiment: "positive" as const },
        { id: "3", name: "Rodri", position: "Midfielder", rating: 8.6, pulseScore: 83, mentions: 2450, sentiment: "neutral" as const },
        { id: "4", name: "Phil Foden", position: "Midfielder", rating: 8.4, pulseScore: 80, mentions: 2180, sentiment: "positive" as const },
        { id: "5", name: "Ederson", position: "Goalkeeper", rating: 8.2, pulseScore: 78, mentions: 1890, sentiment: "neutral" as const }
      ]
    },
    {
      teamName: "Liverpool",
      league: "Premier League - England",
      teamLogo: "",
      overallPulse: 88,
      totalMentions: 16540,
      languages: ["English", "Arabic", "Portuguese", "Spanish"],
      players: [
        { id: "1", name: "Mohamed Salah", position: "Forward", rating: 9.2, pulseScore: 93, mentions: 4120, sentiment: "positive" as const },
        { id: "2", name: "Virgil van Dijk", position: "Defender", rating: 8.8, pulseScore: 87, mentions: 2890, sentiment: "positive" as const },
        { id: "3", name: "Darwin Núñez", position: "Forward", rating: 8.5, pulseScore: 82, mentions: 2540, sentiment: "neutral" as const },
        { id: "4", name: "Sadio Mané", position: "Forward", rating: 8.3, pulseScore: 79, mentions: 2320, sentiment: "positive" as const },
        { id: "5", name: "Alisson", position: "Goalkeeper", rating: 8.1, pulseScore: 76, mentions: 1980, sentiment: "neutral" as const }
      ]
    },
    {
      teamName: "Arsenal",
      league: "Premier League - England",
      teamLogo: "",
      overallPulse: 82,
      totalMentions: 13840,
      languages: ["English", "French", "Arabic", "Spanish"],
      players: [
        { id: "1", name: "Bukayo Saka", position: "Forward", rating: 8.9, pulseScore: 90, mentions: 3240, sentiment: "positive" as const },
        { id: "2", name: "Martin Ødegaard", position: "Midfielder", rating: 8.7, pulseScore: 86, mentions: 2890, sentiment: "positive" as const },
        { id: "3", name: "Gabriel Jesus", position: "Forward", rating: 8.4, pulseScore: 81, mentions: 2450, sentiment: "neutral" as const },
        { id: "4", name: "William Saliba", position: "Defender", rating: 8.2, pulseScore: 78, mentions: 2180, sentiment: "positive" as const },
        { id: "5", name: "Aaron Ramsdale", position: "Goalkeeper", rating: 8.0, pulseScore: 75, mentions: 1980, sentiment: "neutral" as const }
      ]
    },
    {
      teamName: "Juventus",
      league: "Serie A - Italy",
      teamLogo: "",
      overallPulse: 79,
      totalMentions: 12940,
      languages: ["Italian", "English", "Portuguese", "Spanish"],
      players: [
        { id: "1", name: "Dusan Vlahovic", position: "Forward", rating: 8.6, pulseScore: 85, mentions: 2940, sentiment: "positive" as const },
        { id: "2", name: "Federico Chiesa", position: "Forward", rating: 8.4, pulseScore: 82, mentions: 2640, sentiment: "positive" as const },
        { id: "3", name: "Paul Pogba", position: "Midfielder", rating: 8.1, pulseScore: 78, mentions: 2340, sentiment: "neutral" as const },
        { id: "4", name: "Gleison Bremer", position: "Defender", rating: 7.9, pulseScore: 75, mentions: 1980, sentiment: "positive" as const },
        { id: "5", name: "Wojciech Szczesny", position: "Goalkeeper", rating: 7.7, pulseScore: 72, mentions: 1740, sentiment: "neutral" as const }
      ]
    }
  ];

  // Multi-language sentiment data
  const languageSentiments = [
    {
      language: "English",
      code: "en",
      positive: 68,
      neutral: 22,
      negative: 10,
      totalPosts: 45280,
      trendingHashtags: ["ChampionsLeague", "PremierLeague", "UCL"]
    },
    {
      language: "Spanish", 
      code: "es",
      positive: 72,
      neutral: 18,
      negative: 10,
      totalPosts: 38420,
      trendingHashtags: ["LaLiga", "ElClasico", "Barcelona"]
    },
    {
      language: "Portuguese",
      code: "pt", 
      positive: 75,
      neutral: 15,
      negative: 10,
      totalPosts: 21850,
      trendingHashtags: ["Futebol", "Champions", "Liverpool"]
    },
    {
      language: "French",
      code: "fr",
      positive: 65,
      neutral: 25,
      negative: 10,
      totalPosts: 18940,
      trendingHashtags: ["Ligue1", "PSG", "Football"]
    },
    {
      language: "Italian",
      code: "it",
      positive: 70,
      neutral: 20,
      negative: 10,
      totalPosts: 16720,
      trendingHashtags: ["SerieA", "Juventus", "Milan"]
    },
    {
      language: "Arabic",
      code: "ar",
      positive: 77,
      neutral: 15,
      negative: 8,
      totalPosts: 14530,
      trendingHashtags: ["محمد_صلاح", "كرة_القدم", "ليفربول"]
    }
  ];

  // AI Predictions for each major team's next match
  const teamPredictions = [
    {
      homeTeam: "FC Barcelona",
      awayTeam: "Atletico Madrid",
      homeWin: 58,
      draw: 25,
      awayWin: 17,
      confidence: 82,
      aiInsight: "Barcelona's attacking prowess at home vs Atletico's defensive solidity creates an interesting tactical battle. Recent form favors Barca.",
      historical: {
        head_to_head: { home_wins: 12, away_wins: 8, draws: 6, total_games: 26 },
        recent_form: { home_form: 78, away_form: 71 },
        home_advantage: 68
      },
      newsImpacts: [
        {
          headline: "Lewandowski returns from injury, ready to face Atletico",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 75
        }
      ],
      keyFactors: [
        { factor: "Attack vs Defense", impact: 12, description: "Classic Barcelona attack vs Atletico defense matchup" },
        { factor: "Home Form", impact: 10, description: "Barcelona strong at Camp Nou this season" }
      ]
    },
    {
      homeTeam: "Real Madrid",
      awayTeam: "Valencia",
      homeWin: 72,
      draw: 18,
      awayWin: 10,
      confidence: 89,
      aiInsight: "Madrid's Bernabeu fortress and Valencia's away struggles make this a clear favorite for Los Blancos. Vinicius Jr. key threat.",
      historical: {
        head_to_head: { home_wins: 18, away_wins: 5, draws: 7, total_games: 30 },
        recent_form: { home_form: 85, away_form: 55 },
        home_advantage: 78
      },
      newsImpacts: [
        {
          headline: "Bellingham extends contract, motivated for weekend clash",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 68
        }
      ],
      keyFactors: [
        { factor: "Home Dominance", impact: 18, description: "Madrid unbeaten at home in La Liga this season" },
        { factor: "Quality Gap", impact: 15, description: "Significant squad depth advantage for Madrid" }
      ]
    },
    {
      homeTeam: "Manchester City",
      awayTeam: "Arsenal",
      homeWin: 55,
      draw: 28,
      awayWin: 17,
      confidence: 76,
      aiInsight: "Title rivals clash at Etihad. City's experience in big games vs Arsenal's improved mentality creates fascinating encounter.",
      historical: {
        head_to_head: { home_wins: 15, away_wins: 8, draws: 4, total_games: 27 },
        recent_form: { home_form: 82, away_form: 74 },
        home_advantage: 65
      },
      newsImpacts: [
        {
          headline: "Haaland fit and ready for Arsenal showdown",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 78
        },
        {
          headline: "Arsenal's Saka doubtful with minor injury concern",
          impact: "negative" as const,
          team: "away" as const,
          confidence: 62
        }
      ],
      keyFactors: [
        { factor: "Big Game Experience", impact: 12, description: "City's proven track record in title races" },
        { factor: "Tactical Battle", impact: 8, description: "Pep vs Arteta adds extra dimension" }
      ]
    },
    {
      homeTeam: "Liverpool",
      awayTeam: "Manchester United",
      homeWin: 48,
      draw: 26,
      awayWin: 26,
      confidence: 71,
      aiInsight: "Classic rivalry at Anfield. Both teams need points - Liverpool's home record vs United's counter-attacking threat creates open game.",
      historical: {
        head_to_head: { home_wins: 13, away_wins: 9, draws: 8, total_games: 30 },
        recent_form: { home_form: 75, away_form: 68 },
        home_advantage: 70
      },
      newsImpacts: [
        {
          headline: "Salah in red-hot form ahead of United clash",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 82
        }
      ],
      keyFactors: [
        { factor: "Rivalry Intensity", impact: 5, description: "Form often goes out the window in this fixture" },
        { factor: "Anfield Atmosphere", impact: 12, description: "Kop creates hostile environment for United" }
      ]
    },
    {
      homeTeam: "AC Milan",
      awayTeam: "Juventus",
      homeWin: 42,
      draw: 32,
      awayWin: 26,
      confidence: 69,
      aiInsight: "Derby d'Italia at San Siro promises tactical chess match. Milan's attacking intent vs Juventus' defensive organization.",
      historical: {
        head_to_head: { home_wins: 11, away_wins: 10, draws: 9, total_games: 30 },
        recent_form: { home_form: 71, away_form: 66 },
        home_advantage: 58
      },
      newsImpacts: [
        {
          headline: "Milan's Leao back from suspension for big match",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 71
        }
      ],
      keyFactors: [
        { factor: "Serie A Prestige", impact: 8, description: "Both teams fighting for top 4 position" },
        { factor: "San Siro Factor", impact: 10, description: "Milan's fortress advantage at home" }
      ]
    },
    {
      homeTeam: "Inter Milan",
      awayTeam: "Napoli",
      homeWin: 52,
      draw: 28,
      awayWin: 20,
      confidence: 74,
      aiInsight: "Inter's home strength meets Napoli's inconsistent away form. Nerazzurri's tactical discipline should prevail at San Siro.",
      historical: {
        head_to_head: { home_wins: 14, away_wins: 8, draws: 8, total_games: 30 },
        recent_form: { home_form: 79, away_form: 61 },
        home_advantage: 72
      },
      newsImpacts: [
        {
          headline: "Lautaro Martinez extends Inter contract, boosting morale",
          impact: "positive" as const,
          team: "home" as const,
          confidence: 66
        }
      ],
      keyFactors: [
        { factor: "Home Record", impact: 14, description: "Inter's impressive home form this season" },
        { factor: "Squad Stability", impact: 9, description: "Inter's consistent lineup vs Napoli's rotation" }
      ]
    }
  ];

  // Mock data for live match pulse
  const liveMatchPulse = {
    matchId: "bcn_vs_getafe_2024",
    homeTeam: {
      name: "FC Barcelona",
      pulse: 89,
      trend: "up" as const,
      sentiment: "on_fire" as const,
      recentMentions: 4280
    },
    awayTeam: {
      name: "Getafe CF",
      pulse: 42,
      trend: "down" as const,
      sentiment: "bad" as const,
      recentMentions: 1120
    },
    matchTime: "67'",
    status: "LIVE" as const,
    totalEngagement: 18420,
    topReactions: ["🔥", "⚽", "👑", "💙", "😍", "🎯", "⭐"],
    trendingHashtags: ["ElClasico", "Lewandowski", "LaLiga", "FCB", "BarcaOn"],
    liveUpdates: [
      {
        text: "Lewandowski scores again! Barcelona fans going absolutely wild! 🔥⚽",
        sentiment: "positive" as const,
        team: "home" as const,
        timestamp: "65'"
      },
      {
        text: "Getafe looking completely outplayed here. No answer to Barca's attack",
        sentiment: "negative" as const,
        team: "away" as const,
        timestamp: "63'"
      },
      {
        text: "This Barcelona team is absolutely on fire tonight! What a performance! 😍",
        sentiment: "positive" as const,
        team: "home" as const,
        timestamp: "61'"
      }
    ]
  };

  // Champions League match pulse
  const championsLeaguePulse = {
    matchId: "liv_vs_psg_ucl_2024",
    homeTeam: {
      name: "Liverpool",
      pulse: 76,
      trend: "stable" as const,
      sentiment: "good" as const,
      recentMentions: 3650
    },
    awayTeam: {
      name: "Paris Saint-Germain",
      pulse: 68,
      trend: "up" as const,
      sentiment: "okay" as const,
      recentMentions: 2890
    },
    matchTime: "34'",
    status: "LIVE" as const,
    totalEngagement: 22540,
    topReactions: ["⚽", "🔴", "💙", "🏆", "⭐", "🚀", "👑"],
    trendingHashtags: ["UCL", "LIVPSG", "ChampionsLeague", "Anfield", "YNWA"],
    liveUpdates: [
      {
        text: "Salah nearly breaks the deadlock! Anfield is electric tonight ⚡",
        sentiment: "positive" as const,
        team: "home" as const,
        timestamp: "32'"
      },
      {
        text: "PSG showing much better in the last 10 minutes. Mbappe threat growing",
        sentiment: "positive" as const,
        team: "away" as const,
        timestamp: "28'"
      },
      {
        text: "This Champions League atmosphere is absolutely insane! 🏆",
        sentiment: "positive" as const,
        team: "both" as const,
        timestamp: "25'"
      }
    ]
  };

  // Mock data for AI Pre-Match Analysis
  const preMatchAnalysis = {
    homeTeam: {
      teamName: "Manchester City",
      teamColor: "#6CABDD",
      overallForm: 87,
      keyPlayers: [
        {
          name: "Erling Haaland",
          position: "ST",
          formRating: 94,
          keyStrengths: ["Clinical finishing", "Aerial dominance", "Off-ball movement"],
          concerns: ["Link-up play under pressure"],
          mediaScore: 89
        },
        {
          name: "Kevin De Bruyne",
          position: "CAM",
          formRating: 91,
          keyStrengths: ["Vision", "Set pieces", "Long-range passing"],
          concerns: ["Injury concerns"],
          mediaScore: 88
        }
      ],
      tactics: {
        formation: "4-3-3 False 9",
        style: "High possession, progressive build-up",
        effectiveness: 89
      },
      strengths: ["Midfield creativity", "Squad depth", "Home form"],
      weaknesses: ["Defensive transitions", "Set-piece defending"],
      expertOpinions: [
        {
          source: "Sky Sports",
          quote: "City's midfield dominance will be crucial against Tottenham's high press",
          sentiment: "positive" as const
        },
        {
          source: "BBC Sport",
          quote: "Haaland's form suggests another goalscoring masterclass is imminent",
          sentiment: "positive" as const
        }
      ],
      webSources: 47,
      analysisConfidence: 92
    },
    awayTeam: {
      teamName: "Tottenham",
      teamColor: "#132257",
      overallForm: 72,
      keyPlayers: [
        {
          name: "Harry Kane",
          position: "ST",
          formRating: 86,
          keyStrengths: ["Movement in box", "Leadership", "Penalty taking"],
          concerns: ["Service from midfield", "Big game mentality"],
          mediaScore: 81
        },
        {
          name: "Son Heung-min",
          position: "LW",
          formRating: 78,
          keyStrengths: ["Pace on counter", "Left foot finishing"],
          concerns: ["Consistency in away games"],
          mediaScore: 75
        }
      ],
      tactics: {
        formation: "3-5-2 Counter",
        style: "Direct transitions, wing-back overlap",
        effectiveness: 74
      },
      strengths: ["Counter-attacking speed", "Set-piece threat", "Defensive organization"],
      weaknesses: ["Away form", "Midfield physicality", "Squad depth"],
      expertOpinions: [
        {
          source: "The Guardian",
          quote: "Spurs must exploit City's high line with Kane and Son's pace",
          sentiment: "neutral" as const
        },
        {
          source: "ESPN",
          quote: "Tottenham's defensive frailties could be exposed by City's fluid attack",
          sentiment: "negative" as const
        }
      ],
      webSources: 38,
      analysisConfidence: 87
    },
    matchDate: "March 15, 2024",
    competition: "Premier League"
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personalized":
        return <PersonalizedFeed />;
        
      case "favorites":
        return <FavoriteTeamsDashboard />;
        
      case "notifications":
        return <NotificationPreferences />;
        
      case "home":
        return (
          <div className="space-y-6">
            {/* Real Match Data Loader Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                📊 Real Match Data (Sep 15-30, 2025)
              </h2>
              <RealMatchDataLoader />
              <RealMatchList />
            </div>

            {/* Live Match Pulse Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                <span>🔥 Live Match Pulse</span>
                <span className="text-sm font-normal text-muted-foreground">(Real-time fan reactions)</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <MatchPulse matchData={liveMatchPulse} />
                <MatchPulse matchData={championsLeaguePulse} />
              </div>
            </div>

            {/* Fan Pulse Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SentimentMeter {...sentiment} />
              <MultiLanguageSentiment 
                languages={languageSentiments}
                totalMentions={languageSentiments.reduce((sum, lang) => sum + lang.totalPosts, 0)}
              />
            </div>

            {/* Team Pulse Rating Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Team Pulse Ratings</h2>
              <div className="grid grid-cols-1 gap-4">
                {majorTeams.slice(0, 4).map((team, index) => (
                  <TeamPulseRating 
                    key={index}
                    teamName={team.teamName}
                    league={team.league}
                    teamLogo={team.teamLogo}
                    overallPulse={team.overallPulse}
                    totalMentions={team.totalMentions}
                    players={team.players}
                    languages={team.languages}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Live Matches</h2>
                <p className="text-sm text-muted-foreground">Real-time football analytics</p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
            </div>
            
            <div className="grid gap-4">
              {liveMatches.map((match, index) => (
                <LiveMatch key={index} {...match} />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Active Matches"
                value="12"
                subtitle="Premier League"
                icon={Zap}
                color="text-accent"
                trend="up"
              />
              <StatCard
                title="Fan Engagement"
                value="98.2K"
                subtitle="Live interactions"
                icon={Users}
                color="text-success"
                trend="up"
              />
            </div>
          </div>
        );
        
      case "predictions":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Team Predictions</h2>
              <p className="text-sm text-muted-foreground">Next match predictions for major European clubs</p>
            </div>
            
            <div className="space-y-4">
              {teamPredictions.map((prediction, index) => (
                <EnhancedPrediction key={index} {...prediction} />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Accuracy Rate"
                value="84.3%"
                subtitle="Last 30 days"
                icon={Target}
                color="text-ai-green"
                trend="up"
              />
              <StatCard
                title="Model Score"
                value="9.2/10"
                subtitle="Confidence level"
                icon={TrendingUp}
                color="text-primary"
                trend="up"
              />
            </div>
          </div>
        );
        
      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Analytics</h2>
              <p className="text-sm text-muted-foreground">AI-powered social media insights & trending analysis</p>
            </div>
            
            <AIAnalytics {...aiAnalytics} />
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Mentions/Hour"
                value="2.4K"
                subtitle="Peak activity"
                icon={MessageCircle}
                color="text-accent"
                trend="up"
              />
              <StatCard
                title="AI Insights"
                value="127"
                subtitle="Generated today"
                icon={Brain}
                color="text-ai-green"
                trend="up"
              />
            </div>
          </div>
        );

      case "team-of-week":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Team of the Week</h2>
              <p className="text-sm text-muted-foreground">Best players based on fan sentiment & performance</p>
            </div>
            
            <TeamOfTheWeek />
          </div>
        );

      case "fixtures-intelligence":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Fixtures Intelligence</h2>
              <p className="text-sm text-muted-foreground">Pre-match analysis & predictions powered by AI</p>
            </div>
            
            <AIFixturesIntelligence />
          </div>
        );

      case "pulse":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Live Fan Pulse</h2>
              <p className="text-sm text-muted-foreground">Real-time fan sentiment & team pulse ratings</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SentimentMeter {...sentiment} />
              <MultiLanguageSentiment 
                languages={languageSentiments}
                totalMentions={languageSentiments.reduce((sum, lang) => sum + lang.totalPosts, 0)}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Team Pulse Ratings</h3>
              <div className="grid grid-cols-1 gap-4">
                {majorTeams.slice(0, 4).map((team, index) => (
                  <TeamPulseRating 
                    key={index}
                    teamName={team.teamName}
                    league={team.league}
                    teamLogo={team.teamLogo}
                    overallPulse={team.overallPulse}
                    totalMentions={team.totalMentions}
                    players={team.players}
                    languages={team.languages}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Active Teams"
                value="64"
                subtitle="Tracked teams"
                icon={Users}
                color="text-primary"
                trend="up"
              />
              <StatCard
                title="Live Pulse"
                value="89.2"
                subtitle="Average score"
                icon={TrendingUp}
                color="text-success"
                trend="up"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-6 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Live Fan Pulse</h1>
                <p className="text-sm opacity-90">Football Analytics Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
