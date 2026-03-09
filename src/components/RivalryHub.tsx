import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CLUB_RIVALRIES, getClubInfo, getSentimentCategory } from "@/lib/constants";
import { Swords, Flame, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getTeamLogo } from "@/lib/teamLogos";

interface RivalrySentiment {
  club1Score: number;
  club2Score: number;
  club1Emoji: string;
  club2Emoji: string;
  lastUpdated: string | null;
  hasData: boolean;
}

export function RivalryHub() {
  const [expandedRivalry, setExpandedRivalry] = useState<string | null>(null);
  const [sentiments, setSentiments] = useState<Record<string, RivalrySentiment>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRivalrySentiments();
  }, []);

  const fetchRivalrySentiments = async () => {
    try {
      // Fetch latest sentiment snapshots
      const { data: snapshots } = await supabase
        .from("sentiment_snapshots")
        .select("*, match:matches(id, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name))")
        .order("created_at", { ascending: false })
        .limit(100);

      const rivalryData: Record<string, RivalrySentiment> = {};

      for (const rivalry of CLUB_RIVALRIES) {
        const club1 = getClubInfo(rivalry.clubs[0]);
        const club2 = getClubInfo(rivalry.clubs[1]);
        if (!club1 || !club2) continue;

        // Find snapshots involving these clubs
        const relevantSnapshots = (snapshots || []).filter((s: any) => {
          const homeName = s.match?.home_team?.name?.toLowerCase() || "";
          const awayName = s.match?.away_team?.name?.toLowerCase() || "";
          const club1Match = club1.aliases.some(a => homeName.includes(a.toLowerCase()) || awayName.includes(a.toLowerCase()));
          const club2Match = club2.aliases.some(a => homeName.includes(a.toLowerCase()) || awayName.includes(a.toLowerCase()));
          return club1Match || club2Match;
        });

        if (relevantSnapshots.length > 0) {
          // Calculate average sentiment for each club
          let club1Total = 0, club1Count = 0;
          let club2Total = 0, club2Count = 0;
          let latestDate: string | null = null;

          for (const snap of relevantSnapshots.slice(0, 5)) {
            const homeName = snap.match?.home_team?.name?.toLowerCase() || "";
            const awayName = snap.match?.away_team?.name?.toLowerCase() || "";
            
            const isClub1Home = club1.aliases.some(a => homeName.includes(a.toLowerCase()));
            const isClub1Away = club1.aliases.some(a => awayName.includes(a.toLowerCase()));
            const isClub2Home = club2.aliases.some(a => homeName.includes(a.toLowerCase()));
            const isClub2Away = club2.aliases.some(a => awayName.includes(a.toLowerCase()));

            if (isClub1Home) { club1Total += snap.home_sentiment || 50; club1Count++; }
            if (isClub1Away) { club1Total += snap.away_sentiment || 50; club1Count++; }
            if (isClub2Home) { club2Total += snap.home_sentiment || 50; club2Count++; }
            if (isClub2Away) { club2Total += snap.away_sentiment || 50; club2Count++; }

            if (!latestDate || snap.created_at > latestDate) {
              latestDate = snap.created_at;
            }
          }

          const club1Avg = club1Count > 0 ? Math.round(club1Total / club1Count) : 50;
          const club2Avg = club2Count > 0 ? Math.round(club2Total / club2Count) : 50;

          rivalryData[rivalry.name] = {
            club1Score: club1Avg,
            club2Score: club2Avg,
            club1Emoji: getSentimentCategory(club1Avg).emoji,
            club2Emoji: getSentimentCategory(club2Avg).emoji,
            lastUpdated: latestDate,
            hasData: true,
          };
        } else {
          rivalryData[rivalry.name] = {
            club1Score: 50,
            club2Score: 50,
            club1Emoji: "😐",
            club2Emoji: "😐",
            lastUpdated: null,
            hasData: false,
          };
        }
      }

      setSentiments(rivalryData);
    } catch (error) {
      console.error("Failed to fetch rivalry sentiments:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (isoString: string | null): string => {
    if (!isoString) return "";
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" /> Rivalry Hub
          </h2>
          <p className="text-sm text-muted-foreground">Loading rivalry data...</p>
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" /> Rivalry Hub
        </h2>
        <p className="text-sm text-muted-foreground">
          Which fanbase is feeling better? Live sentiment face-offs.
        </p>
      </div>

      <div className="space-y-3">
        {CLUB_RIVALRIES.map((rivalry, i) => {
          const club1 = getClubInfo(rivalry.clubs[0]);
          const club2 = getClubInfo(rivalry.clubs[1]);
          if (!club1 || !club2) return null;

          const data = sentiments[rivalry.name] || {
            club1Score: 50,
            club2Score: 50,
            club1Emoji: "😐",
            club2Emoji: "😐",
            lastUpdated: null,
            hasData: false,
          };

          const total = data.club1Score + data.club2Score;
          const pct1 = total > 0 ? Math.round((data.club1Score / total) * 100) : 50;
          const pct2 = 100 - pct1;
          const isExpanded = expandedRivalry === rivalry.name;

          return (
            <motion.div
              key={rivalry.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                onClick={() =>
                  setExpandedRivalry(isExpanded ? null : rivalry.name)
                }
              >
                {/* Intensity bar */}
                <div className="h-1 flex">
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${pct1}%`,
                      backgroundColor: club1.color,
                    }}
                  />
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${pct2}%`,
                      backgroundColor: club2.color,
                    }}
                  />
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Rivalry name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-bold text-foreground">
                        {rivalry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {data.lastUpdated && (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(data.lastUpdated)}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className="text-[10px] border-destructive/30 text-destructive"
                      >
                        🔥 {rivalry.intensity}%
                      </Badge>
                    </div>
                  </div>

                  {/* No data warning */}
                  {!data.hasData && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
                      <AlertCircle className="w-3 h-3" />
                      Awaiting match data for real sentiment
                    </div>
                  )}

                  {/* Tug of war */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <img 
                          src={getTeamLogo(club1.shortName)} 
                          alt={club1.shortName}
                          className="w-6 h-6 object-contain"
                        />
                        <p className="text-sm font-semibold text-foreground">
                          {club1.shortName}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-lg">{data.club1Emoji}</span>
                        <p className="text-lg font-bold" style={{ color: club1.color }}>
                          {data.club1Score}
                        </p>
                      </div>
                    </div>

                    {/* Visual bar */}
                    <div className="w-24 h-3 rounded-full bg-muted overflow-hidden flex">
                      <motion.div
                        className="h-full rounded-l-full"
                        initial={{ width: "50%" }}
                        animate={{ width: `${pct1}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        style={{ backgroundColor: club1.color }}
                      />
                      <motion.div
                        className="h-full rounded-r-full"
                        initial={{ width: "50%" }}
                        animate={{ width: `${pct2}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        style={{ backgroundColor: club2.color }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {club2.shortName}
                        </p>
                        <img 
                          src={getTeamLogo(club2.shortName)} 
                          alt={club2.shortName}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-lg font-bold" style={{ color: club2.color }}>
                          {data.club2Score}
                        </p>
                        <span className="text-lg">{data.club2Emoji}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded info */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pt-2 border-t border-border"
                    >
                      <p className="text-xs text-muted-foreground">
                        {rivalry.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {data.hasData 
                          ? "Sentiment based on latest social media analysis from Gemini AI"
                          : "Sentiment will update after upcoming matches between these teams"
                        }
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
