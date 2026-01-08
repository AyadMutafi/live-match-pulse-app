import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart3 } from "lucide-react";

interface PlatformData {
  platform: string;
  icon: string;
  mentions: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  color: string;
}

const platformData: PlatformData[] = [
  {
    platform: "Twitter",
    icon: "𝕏",
    mentions: 145000,
    positivePercent: 62,
    neutralPercent: 25,
    negativePercent: 13,
    color: "#1DA1F2"
  },
  {
    platform: "Reddit",
    icon: "📱",
    mentions: 78000,
    positivePercent: 55,
    neutralPercent: 32,
    negativePercent: 13,
    color: "#FF4500"
  },
  {
    platform: "Instagram",
    icon: "📸",
    mentions: 92000,
    positivePercent: 71,
    neutralPercent: 21,
    negativePercent: 8,
    color: "#E4405F"
  }
];

export function PlatformBreakdown() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalMentions = platformData.reduce((sum, p) => sum + p.mentions, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Sentiment by Platform
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Breakdown of fan sentiment across social platforms
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {platformData.map((platform) => (
          <div key={platform.platform} className="space-y-3">
            {/* Platform header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{platform.icon}</span>
                <span className="font-medium">{platform.platform}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {formatNumber(platform.mentions)} mentions
              </Badge>
            </div>

            {/* Sentiment bars */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Positive</span>
                <div className="flex-1">
                  <Progress 
                    value={platform.positivePercent} 
                    className="h-2 bg-muted"
                  />
                </div>
                <span className="text-xs text-[hsl(var(--success))] w-10 text-right">
                  {platform.positivePercent}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Neutral</span>
                <div className="flex-1">
                  <Progress 
                    value={platform.neutralPercent} 
                    className="h-2 bg-muted [&>div]:bg-muted-foreground"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {platform.neutralPercent}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Negative</span>
                <div className="flex-1">
                  <Progress 
                    value={platform.negativePercent} 
                    className="h-2 bg-muted [&>div]:bg-[hsl(var(--destructive))]"
                  />
                </div>
                <span className="text-xs text-[hsl(var(--destructive))] w-10 text-right">
                  {platform.negativePercent}%
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Total summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Fan Mentions</span>
            <span className="font-bold text-lg">{formatNumber(totalMentions)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
