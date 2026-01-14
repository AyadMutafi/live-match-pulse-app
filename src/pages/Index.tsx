import { ClubSentimentOverview } from "@/components/ClubSentimentOverview";
import { RivalryWatch } from "@/components/RivalryWatch";
import { MatchesSection } from "@/components/MatchesSection";
import { AppHeader } from "@/components/AppHeader";
import { LiveSocialFeed } from "@/components/LiveSocialFeed";
import { QuickInsightCard } from "@/components/QuickInsightCard";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { LiveRefreshIndicator } from "@/components/LiveRefreshIndicator";
import { useMatchPulse } from "@/hooks/useMatchPulse";
import { useSmartRefresh } from "@/hooks/useSmartRefresh";
import { Zap, Users, Globe, Radio, Swords, Trophy, Brain } from "lucide-react";
import { AITeamOfWeek } from "@/components/AITeamOfWeek";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { liveMatchesData: realMatchPulse } = useMatchPulse();
  const { refreshState, lastRefresh, liveMatchCount } = useSmartRefresh();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
        {/* Live Refresh Status */}
        <div className="mb-4 p-3 rounded-lg bg-card border border-border">
          <LiveRefreshIndicator
            lastRefresh={lastRefresh}
            refreshInterval={refreshState.interval / 1000}
            isRefreshing={false}
            mode={refreshState.isBoost ? "high-activity" : "normal"}
          />
        </div>

        {/* Monitoring Banner */}
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[hsl(var(--success))] animate-pulse" />
              <span className="font-medium">Monitoring 7 Target Clubs</span>
            </div>
            <Badge variant="outline" className="text-xs">
              La Liga • Premier League
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Barcelona, Real Madrid, Atlético Madrid, Liverpool, Man City, Man United, Arsenal
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuickInsightCard
            icon={Radio}
            title="Live Matches"
            value={realMatchPulse?.length || 0}
            subtitle="Target clubs playing"
            variant="highlight"
          />
          <QuickInsightCard
            icon={Users}
            title="Clubs Monitored"
            value="7"
            subtitle="La Liga & PL"
          />
          <QuickInsightCard
            icon={Swords}
            title="Rivalries"
            value="4"
            subtitle="Active tracking"
          />
          <QuickInsightCard
            icon={Globe}
            title="Languages"
            value="6+"
            subtitle="Monitored"
          />
        </div>

        <div className="space-y-6">
          {/* Club Sentiment Overview - NEW */}
          <CollapsibleSection
            title="Club Sentiment Overview"
            icon={<Brain className="w-5 h-5 text-primary" />}
            badge="AI Powered"
            defaultOpen={true}
          >
            <ClubSentimentOverview />
          </CollapsibleSection>

          {/* Live Matches */}
          <CollapsibleSection
            title="Match Sentiment Monitoring"
            icon={<Zap className="w-5 h-5 text-primary" />}
            defaultOpen={true}
          >
            <MatchesSection />
          </CollapsibleSection>

          {/* Rivalry Watch - NEW */}
          <CollapsibleSection
            title="Rivalry Watch"
            icon={<Swords className="w-5 h-5 text-destructive" />}
            badge="Head-to-Head"
            defaultOpen={true}
          >
            <RivalryWatch />
          </CollapsibleSection>

          {/* Live Social Feed */}
          <CollapsibleSection
            title="Live Social Feed"
            icon={<Radio className="w-5 h-5 text-[hsl(var(--success))]" />}
            badge="Real-time"
            defaultOpen={false}
          >
            <LiveSocialFeed />
          </CollapsibleSection>

          {/* Team of the Week */}
          <CollapsibleSection
            title="AI Team of the Week"
            icon={<Trophy className="w-5 h-5 text-[hsl(var(--warning))]" />}
            badge="AI Generated"
            defaultOpen={false}
          >
            <AITeamOfWeek />
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Sentiment data for 7 target clubs from Twitter, Reddit, and Instagram. Read-only monitoring.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
