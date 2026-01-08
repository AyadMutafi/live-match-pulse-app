import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Radio, 
  BarChart3, 
  Shield, 
  Globe, 
  Zap,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Users
} from "lucide-react";

const dataSources = [
  {
    name: "Twitter / X",
    icon: "𝕏",
    description: "Real-time tweets, hashtags, and fan discussions from the world's largest football community.",
    dataPoints: ["Match reactions", "Player mentions", "Hashtag trends", "Fan sentiment"],
    coverage: "Global",
    updateFrequency: "Real-time"
  },
  {
    name: "Reddit",
    icon: "📱",
    description: "In-depth discussions from r/soccer, team subreddits, and football communities.",
    dataPoints: ["Match threads", "Post-match analysis", "Transfer rumors", "Tactical discussions"],
    coverage: "English-speaking",
    updateFrequency: "Every 5 minutes"
  },
  {
    name: "Instagram",
    icon: "📸",
    description: "Fan engagement metrics, comments, and reactions on official team and player accounts.",
    dataPoints: ["Post engagement", "Story reactions", "Comment sentiment", "Fan demographics"],
    coverage: "Global",
    updateFrequency: "Every 15 minutes"
  }
];

const features = [
  {
    icon: BarChart3,
    title: "Sentiment Analysis",
    description: "AI-powered analysis of fan emotions across multiple languages and platforms."
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description: "Real-time identification of viral moments, trending topics, and emerging narratives."
  },
  {
    icon: Users,
    title: "Player Ratings",
    description: "Aggregated player performance ratings based on fan reactions and discussions."
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Sentiment analysis in English, Spanish, Portuguese, French, Italian, and Arabic."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-4">
            <Radio className="w-3 h-3 mr-1 animate-pulse text-[hsl(var(--success))]" />
            Monitoring Dashboard
          </Badge>
          <h1 className="text-3xl font-bold">About Fan Pulse AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fan Pulse AI is a read-only social media sentiment monitoring dashboard that aggregates 
            and analyzes fan reactions from major social platforms in real-time.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="border-[hsl(var(--warning))]/50 bg-[hsl(var(--warning))]/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-[hsl(var(--warning))] flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Read-Only Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  This dashboard is for monitoring purposes only. We do not collect, store, or process 
                  any user data. All sentiment data is aggregated from public social media posts and 
                  displayed for informational purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Data Sources
          </h2>
          <div className="grid gap-6">
            {dataSources.map((source) => (
              <Card key={source.name}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{source.icon}</span>
                    <div>
                      <CardTitle>{source.name}</CardTitle>
                      <CardDescription>{source.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Points Collected</h4>
                      <div className="flex flex-wrap gap-2">
                        {source.dataPoints.map((point) => (
                          <Badge key={point} variant="secondary" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Coverage:</span>
                        <span>{source.coverage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Updates:</span>
                        <span>{source.updateFrequency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6 text-center">Monitoring Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Platforms Monitored</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">6+</div>
                  <div className="text-sm text-muted-foreground">Languages Supported</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500K+</div>
                  <div className="text-sm text-muted-foreground">Daily Mentions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">Real-time</div>
                  <div className="text-sm text-muted-foreground">Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          <p>
            Fan Pulse AI aggregates publicly available data for analytical purposes only.
            We are not affiliated with any social media platform or football organization.
          </p>
        </div>
      </div>
    </div>
  );
}
