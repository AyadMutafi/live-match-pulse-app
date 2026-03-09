import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSentimentCategory, getClubInfo } from "@/lib/constants";
import { toast } from "sonner";
import { Bell, TrendingDown, TrendingUp, Flame } from "lucide-react";

interface SentimentAlertProps {
  favoriteClubs: string[];
  enabled?: boolean;
}

interface ClubSentimentState {
  clubName: string;
  lastSentiment: number;
  lastChecked: Date;
}

const ALERT_THRESHOLDS = {
  spike: 85, // Alert when sentiment goes above this
  drop: 30,  // Alert when sentiment drops below this
  change: 15, // Alert on rapid change of this many points
};

const CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes

export function SentimentAlert({ favoriteClubs, enabled = true }: SentimentAlertProps) {
  const [sentimentState, setSentimentState] = useState<Record<string, ClubSentimentState>>({});
  const lastAlertTime = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!enabled || favoriteClubs.length === 0) return;

    const checkSentiments = async () => {
      try {
        // Fetch latest sentiment snapshots
        const { data: snapshots } = await supabase
          .from("sentiment_snapshots")
          .select("*, match:matches(id, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name))")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!snapshots) return;

        for (const clubName of favoriteClubs) {
          const club = getClubInfo(clubName);
          if (!club) continue;

          // Find relevant snapshots for this club
          const clubSnapshots = snapshots.filter((s: any) => {
            const homeName = s.match?.home_team?.name?.toLowerCase() || "";
            const awayName = s.match?.away_team?.name?.toLowerCase() || "";
            return club.aliases.some(a => 
              homeName.includes(a.toLowerCase()) || awayName.includes(a.toLowerCase())
            );
          });

          if (clubSnapshots.length === 0) continue;

          // Calculate current sentiment
          let totalSentiment = 0;
          let count = 0;

          for (const snap of clubSnapshots.slice(0, 3)) {
            const homeName = snap.match?.home_team?.name?.toLowerCase() || "";
            const isHome = club.aliases.some(a => homeName.includes(a.toLowerCase()));
            
            if (isHome) {
              totalSentiment += snap.home_sentiment || 50;
            } else {
              totalSentiment += snap.away_sentiment || 50;
            }
            count++;
          }

          const currentSentiment = count > 0 ? Math.round(totalSentiment / count) : 50;
          const previousState = sentimentState[club.shortName];
          const now = Date.now();
          const lastAlert = lastAlertTime.current[club.shortName] || 0;
          const canAlert = now - lastAlert > 5 * 60 * 1000; // 5 min cooldown

          // Check for alert conditions
          if (canAlert && previousState) {
            const change = currentSentiment - previousState.lastSentiment;
            const category = getSentimentCategory(currentSentiment);

            // Sentiment spike alert
            if (currentSentiment >= ALERT_THRESHOLDS.spike && previousState.lastSentiment < ALERT_THRESHOLDS.spike) {
              lastAlertTime.current[club.shortName] = now;
              toast.success(
                `🔥 ${club.shortName} fans are ON FIRE!`,
                {
                  description: `Sentiment spiked to ${currentSentiment}% ${category.emoji}`,
                  icon: <Flame className="w-5 h-5 text-destructive" />,
                  duration: 8000,
                }
              );
            }
            // Sentiment drop alert
            else if (currentSentiment <= ALERT_THRESHOLDS.drop && previousState.lastSentiment > ALERT_THRESHOLDS.drop) {
              lastAlertTime.current[club.shortName] = now;
              toast.error(
                `😤 ${club.shortName} fans are FRUSTRATED`,
                {
                  description: `Sentiment dropped to ${currentSentiment}% ${category.emoji}`,
                  icon: <TrendingDown className="w-5 h-5" />,
                  duration: 8000,
                }
              );
            }
            // Rapid positive change
            else if (change >= ALERT_THRESHOLDS.change) {
              lastAlertTime.current[club.shortName] = now;
              toast(
                `📈 ${club.shortName} mood improving!`,
                {
                  description: `+${change} points to ${currentSentiment}% ${category.emoji}`,
                  icon: <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />,
                  duration: 6000,
                }
              );
            }
            // Rapid negative change
            else if (change <= -ALERT_THRESHOLDS.change) {
              lastAlertTime.current[club.shortName] = now;
              toast(
                `📉 ${club.shortName} mood dropping`,
                {
                  description: `${change} points to ${currentSentiment}% ${category.emoji}`,
                  icon: <TrendingDown className="w-5 h-5 text-destructive" />,
                  duration: 6000,
                }
              );
            }
          }

          // Update state
          setSentimentState(prev => ({
            ...prev,
            [club.shortName]: {
              clubName: club.shortName,
              lastSentiment: currentSentiment,
              lastChecked: new Date(),
            },
          }));
        }
      } catch (error) {
        console.error("Sentiment alert check failed:", error);
      }
    };

    // Initial check
    checkSentiments();

    // Set up interval
    const interval = setInterval(checkSentiments, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [favoriteClubs, enabled]);

  // This component doesn't render anything visible
  return null;
}
