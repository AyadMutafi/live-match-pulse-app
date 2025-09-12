import { useState, useEffect } from "react";
import { LiveMatch } from "@/components/LiveMatch";
import { PredictionCard } from "@/components/PredictionCard";
import { SentimentMeter } from "@/components/SentimentMeter";
import { BottomNavigation } from "@/components/BottomNavigation";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Users, Target, TrendingUp } from "lucide-react";

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

  const predictions = {
    homeTeam: "Manchester City",
    awayTeam: "Tottenham",
    homeWin: 65,
    draw: 20,
    awayWin: 15,
    confidence: 87,
    aiInsight: "City's superior home form and recent tactical adjustments give them a significant edge. Spurs' defensive vulnerabilities against possession-heavy teams favor the home side."
  };

  const sentiment = {
    positive: 68,
    neutral: 22,
    negative: 10,
    totalMentions: 24673,
    trending: ["MCITOT", "Haaland", "Kane", "PremierLeague", "Pep"]
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Live Matches</h2>
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
              <h2 className="text-2xl font-bold text-foreground">AI Predictions</h2>
              <p className="text-sm text-muted-foreground">Advanced analytics & forecasting</p>
            </div>
            
            <PredictionCard {...predictions} />
            
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
              <h2 className="text-2xl font-bold text-foreground">Fan Pulse</h2>
              <p className="text-sm text-muted-foreground">Social media sentiment analysis</p>
            </div>
            
            <SentimentMeter {...sentiment} />
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Mentions/Hour"
                value="2.4K"
                subtitle="Peak activity"
                icon={TrendingUp}
                color="text-accent"
                trend="up"
              />
              <StatCard
                title="Influencer Posts"
                value="127"
                subtitle="Verified accounts"
                icon={Users}
                color="text-warning"
                trend="neutral"
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
