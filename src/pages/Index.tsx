import { MatchesSection } from "@/components/MatchesSection";
import { SentimentMeter } from "@/components/SentimentMeter";
import { AppHeader } from "@/components/AppHeader";
import { MultiLanguageSentiment } from "@/components/MultiLanguageSentiment";
import { LiveFanReactions } from "@/components/LiveFanReactions";
import { AITeamOfWeek } from "@/components/AITeamOfWeek";
import { QuickInsightCard } from "@/components/QuickInsightCard";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { MatchTopFlop } from "@/components/MatchTopFlop";
import { MonitoringBanner } from "@/components/MonitoringBanner";
import { LiveSocialFeed } from "@/components/LiveSocialFeed";
import { TopViralPosts } from "@/components/TopViralPosts";
import { MostMentionedPlayers } from "@/components/MostMentionedPlayers";
import { PlatformBreakdown } from "@/components/PlatformBreakdown";
import { RefreshStatusIndicator } from "@/components/RefreshStatusIndicator";
import { useMatchPulse } from "@/hooks/useMatchPulse";
import { useSmartRefresh } from "@/hooks/useSmartRefresh";
import { Zap, Users, Globe, TrendingUp, BarChart3, Trophy, Star, Radio, MessageSquare } from "lucide-react";

const Index = () => {
  // Fetch real match data
  const { liveMatchesData: realMatchPulse } = useMatchPulse();
  
  // Smart auto-refresh system
  const { refreshState, lastRefresh, liveMatchCount } = useSmartRefresh();

  // Sentiment data (read-only display)
  const sentiment = {
    positive: 68,
    neutral: 22,
    negative: 10,
    totalMentions: 315000,
    trending: ["PremierLeague", "LaLiga", "UCL", "Haaland", "Bellingham"]
  };

  // Multi-language sentiment data (read-only)
  const languageSentiments = [
    {
      language: "English",
      code: "en",
      positive: 68,
      neutral: 22,
      negative: 10,
      totalPosts: 145280,
      trendingHashtags: ["ChampionsLeague", "PremierLeague", "UCL"]
    },
    {
      language: "Spanish", 
      code: "es",
      positive: 72,
      neutral: 18,
      negative: 10,
      totalPosts: 98420,
      trendingHashtags: ["LaLiga", "ElClasico", "Barcelona"]
    },
    {
      language: "Portuguese",
      code: "pt", 
      positive: 75,
      neutral: 15,
      negative: 10,
      totalPosts: 41850,
      trendingHashtags: ["Futebol", "Champions", "Liverpool"]
    },
    {
      language: "French",
      code: "fr",
      positive: 65,
      neutral: 25,
      negative: 10,
      totalPosts: 28940,
      trendingHashtags: ["Ligue1", "PSG", "Football"]
    },
    {
      language: "Italian",
      code: "it",
      positive: 70,
      neutral: 20,
      negative: 10,
      totalPosts: 26720,
      trendingHashtags: ["SerieA", "Juventus", "Milan"]
    },
    {
      language: "Arabic",
      code: "ar",
      positive: 77,
      neutral: 15,
      negative: 8,
      totalPosts: 24530,
      trendingHashtags: ["محمد_صلاح", "كرة_القدم", "ليفربول"]
    }
  ];

  const totalMentions = languageSentiments.reduce((sum, lang) => sum + lang.totalPosts, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
        {/* Smart Refresh Status */}
        <div className="mb-4 p-3 rounded-lg bg-card border border-border">
          <RefreshStatusIndicator
            interval={refreshState.interval}
            reason={refreshState.reason}
            isBoost={refreshState.isBoost}
            lastRefresh={lastRefresh}
            liveMatchCount={liveMatchCount}
          />
        </div>

        {/* Monitoring Banner */}
        <MonitoringBanner />

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuickInsightCard
            icon={Radio}
            title="Live Matches"
            value={realMatchPulse?.length || 0}
            subtitle="Being monitored"
            variant="highlight"
          />
          <QuickInsightCard
            icon={MessageSquare}
            title="Total Mentions"
            value={`${(totalMentions / 1000).toFixed(0)}K`}
            subtitle="Last 24 hours"
          />
          <QuickInsightCard
            icon={Users}
            title="Platforms"
            value="3"
            subtitle="Twitter, Reddit, IG"
          />
          <QuickInsightCard
            icon={Globe}
            title="Languages"
            value="6+"
            subtitle="Monitored"
          />
        </div>

        <div className="space-y-6">
          {/* Matches Section with Filters */}
          <CollapsibleSection
            title="Match Sentiment Monitoring"
            icon={<Zap className="w-5 h-5 text-primary" />}
            defaultOpen={true}
          >
            <MatchesSection />
          </CollapsibleSection>

          {/* Live Social Feed */}
          <CollapsibleSection
            title="Live Social Feed"
            icon={<Radio className="w-5 h-5 text-[hsl(var(--success))]" />}
            badge="Real-time"
            defaultOpen={true}
          >
            <LiveSocialFeed />
          </CollapsibleSection>

          {/* Platform Breakdown */}
          <CollapsibleSection
            title="Sentiment by Platform"
            icon={<BarChart3 className="w-5 h-5 text-primary" />}
            defaultOpen={false}
          >
            <PlatformBreakdown />
          </CollapsibleSection>

          {/* Fan Reactions (Read-Only Display) */}
          <CollapsibleSection
            title="Top Fan Reactions"
            icon={<TrendingUp className="w-5 h-5 text-accent" />}
            badge="Aggregated"
            defaultOpen={false}
          >
            <LiveFanReactions />
          </CollapsibleSection>

          {/* Sentiment Overview */}
          <CollapsibleSection
            title="Global Fan Sentiment"
            icon={<Globe className="w-5 h-5 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <SentimentMeter {...sentiment} />
              <MultiLanguageSentiment 
                languages={languageSentiments}
                totalMentions={totalMentions}
              />
            </div>
          </CollapsibleSection>

          {/* Most Mentioned Players */}
          <section id="players">
            <CollapsibleSection
              title="Most Mentioned Players"
              icon={<Users className="w-5 h-5 text-primary" />}
              badge="This Week"
              defaultOpen={false}
            >
              <MostMentionedPlayers />
            </CollapsibleSection>
          </section>

          {/* Top & Flop Players */}
          <CollapsibleSection
            title="Top & Flop of the Match"
            icon={<Star className="w-5 h-5 text-[hsl(var(--success))]" />}
            badge="Sentiment"
            defaultOpen={false}
          >
            <MatchTopFlop />
          </CollapsibleSection>

          {/* Team of the Week */}
          <CollapsibleSection
            title="Team of the Week"
            icon={<Trophy className="w-5 h-5 text-[hsl(var(--warning))]" />}
            badge="AI Generated"
            defaultOpen={false}
          >
            <AITeamOfWeek />
          </CollapsibleSection>

          {/* Top Viral Posts */}
          <CollapsibleSection
            title="Top Viral Posts"
            icon={<TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />}
            defaultOpen={false}
          >
            <TopViralPosts />
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Data aggregated from Twitter, Reddit, and Instagram. All metrics are read-only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
