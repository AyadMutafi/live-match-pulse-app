import { useState, useEffect } from "react";
import { LiveMatch } from "@/components/LiveMatch";
import { EnhancedPrediction } from "@/components/EnhancedPrediction";
import { SentimentMeter } from "@/components/SentimentMeter";
import { AIAnalytics } from "@/components/AIAnalytics";
import { BottomNavigation } from "@/components/BottomNavigation";
import { StatCard } from "@/components/StatCard";
import { TeamPulseRating } from "@/components/TeamPulseRating";
import { MultiLanguageSentiment } from "@/components/MultiLanguageSentiment";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Users, Target, TrendingUp, MessageCircle, Brain } from "lucide-react";

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

  const enhancedPredictions = {
    homeTeam: "Manchester City",
    awayTeam: "Tottenham",
    homeWin: 65,
    draw: 20,
    awayWin: 15,
    confidence: 87,
    aiInsight: "City's superior home form and recent tactical adjustments give them a significant edge. Spurs' defensive vulnerabilities against possession-heavy teams favor the home side.",
    historical: {
      head_to_head: { home_wins: 15, away_wins: 8, draws: 4, total_games: 27 },
      recent_form: { home_form: 85, away_form: 62 },
      home_advantage: 73
    },
    newsImpacts: [
      {
        headline: "Haaland back to full fitness after minor knock, expected to start",
        impact: "positive" as const,
        team: "home" as const,
        confidence: 78
      },
      {
        headline: "Tottenham's key defender Romero ruled out with injury",
        impact: "negative" as const,
        team: "away" as const,
        confidence: 65
      },
      {
        headline: "Pep Guardiola praises team's recent training sessions",
        impact: "positive" as const,
        team: "home" as const,
        confidence: 45
      }
    ],
    keyFactors: [
      {
        factor: "Home Form",
        impact: 15,
        description: "City has won 8 of their last 10 home matches"
      },
      {
        factor: "Head-to-Head",
        impact: 12,
        description: "City leads recent encounters 4-1 in last 5 meetings"
      },
      {
        factor: "Injury Impact",
        impact: -8,
        description: "Spurs missing key defensive players"
      },
      {
        factor: "Squad Depth",
        impact: 10,
        description: "City's rotation options provide tactical flexibility"
      }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Fan Pulse Section at the top */}
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
              <h2 className="text-2xl font-bold text-foreground">Enhanced AI Predictions</h2>
              <p className="text-sm text-muted-foreground">Advanced analytics, historical data & news impact</p>
            </div>
            
            <EnhancedPrediction {...enhancedPredictions} />
            
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
        
      case "pulse":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Social Analytics</h2>
              <p className="text-sm text-muted-foreground">Real-time tweet analysis & sentiment tracking</p>
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
          <div className="flex items-center space-x-3 mb-2">
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

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
