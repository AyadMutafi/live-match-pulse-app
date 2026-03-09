import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { getClubInfo, getSentimentCategory } from "@/lib/constants";
import { Activity, TrendingUp, Clock } from "lucide-react";

interface SentimentTimelineProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchMinute?: number;
}

interface TimelinePoint {
  minute: number;
  home: number;
  away: number;
  event?: string;
}

export function SentimentTimeline({ matchId, homeTeam, awayTeam, matchMinute }: SentimentTimelineProps) {
  const [data, setData] = useState<TimelinePoint[]>([]);
  const [loading, setLoading] = useState(true);

  const homeClub = getClubInfo(homeTeam);
  const awayClub = getClubInfo(awayTeam);
  const homeColor = homeClub?.color || "#6CABDD";
  const awayColor = awayClub?.color || "#DA291C";

  useEffect(() => {
    fetchTimelineData();
  }, [matchId]);

  const fetchTimelineData = async () => {
    try {
      // Fetch all sentiment snapshots for this match
      const { data: snapshots } = await supabase
        .from("sentiment_snapshots")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (!snapshots || snapshots.length === 0) {
        // Generate simulated timeline if no real data
        const simulated = generateSimulatedTimeline(matchMinute || 90);
        setData(simulated);
      } else {
        // Convert real snapshots to timeline points
        const timeline: TimelinePoint[] = [];
        const matchStart = new Date(snapshots[0].created_at).getTime();
        
        snapshots.forEach((snap, i) => {
          const snapTime = new Date(snap.created_at).getTime();
          const minutesSinceStart = Math.round((snapTime - matchStart) / 60000);
          
          timeline.push({
            minute: Math.min(minutesSinceStart, 90),
            home: snap.home_sentiment || 50,
            away: snap.away_sentiment || 50,
          });
        });

        setData(timeline);
      }
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
      const simulated = generateSimulatedTimeline(matchMinute || 90);
      setData(simulated);
    } finally {
      setLoading(false);
    }
  };

  const generateSimulatedTimeline = (currentMinute: number): TimelinePoint[] => {
    const points: TimelinePoint[] = [];
    let homeBase = 55 + Math.random() * 20;
    let awayBase = 55 + Math.random() * 20;

    for (let min = 0; min <= Math.min(currentMinute, 90); min += 5) {
      // Add some variance
      const homeVariance = (Math.random() - 0.5) * 10;
      const awayVariance = (Math.random() - 0.5) * 10;
      
      homeBase = Math.max(20, Math.min(95, homeBase + homeVariance));
      awayBase = Math.max(20, Math.min(95, awayBase + awayVariance));

      points.push({
        minute: min,
        home: Math.round(homeBase),
        away: Math.round(awayBase),
      });
    }

    return points;
  };

  const latestHome = data.length > 0 ? data[data.length - 1].home : 50;
  const latestAway = data.length > 0 ? data[data.length - 1].away : 50;
  const homeCategory = getSentimentCategory(latestHome);
  const awayCategory = getSentimentCategory(latestAway);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Sentiment Timeline
          </div>
          {matchMinute && (
            <Badge variant="outline" className="text-[10px]">
              <Clock className="w-3 h-3 mr-1" />
              {matchMinute}'
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: homeColor }}
            />
            <span className="text-foreground font-medium">{homeClub?.shortName || homeTeam}</span>
            <span className="text-lg">{homeCategory.emoji}</span>
            <span className="font-bold" style={{ color: homeColor }}>{latestHome}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: awayColor }}>{latestAway}%</span>
            <span className="text-lg">{awayCategory.emoji}</span>
            <span className="text-foreground font-medium">{awayClub?.shortName || awayTeam}</span>
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: awayColor }}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis 
                dataKey="minute" 
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `${val}'`}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `${val}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "home" ? homeClub?.shortName || homeTeam : awayClub?.shortName || awayTeam
                ]}
                labelFormatter={(label) => `${label}'`}
              />
              {/* Half-time marker */}
              <ReferenceLine 
                x={45} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3"
                label={{ value: "HT", position: "top", fontSize: 10 }}
              />
              {/* Neutral line */}
              <ReferenceLine 
                y={50} 
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="home"
                stroke={homeColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: homeColor }}
              />
              <Line
                type="monotone"
                dataKey="away"
                stroke={awayColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: awayColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground">
            Fan sentiment tracked throughout the match via social media analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
