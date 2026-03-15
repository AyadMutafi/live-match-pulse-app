import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, ExternalLink } from "lucide-react";
import { getTeamLogo } from "@/lib/teamLogos";

interface FanSentimentCardProps {
  teamName: string;
  shortName: string;
  sentiment: number;
  emoji: string;
  label: string;
  matchResult?: string;
  highlights?: string[];
  hashtags?: string[];
}

function getSentimentGradient(score: number) {
  if (score >= 80) return "from-[hsl(var(--success))]/20 to-[hsl(var(--success))]/5";
  if (score >= 60) return "from-primary/20 to-primary/5";
  if (score >= 40) return "from-muted/40 to-muted/10";
  return "from-destructive/20 to-destructive/5";
}

export function FanSentimentCard({
  teamName,
  shortName,
  sentiment,
  emoji,
  label,
  matchResult = "After that 3-1 win against Liverpool!",
  highlights = ["Bruno MOTM", "Rashford brace"],
  hashtags = ["#GGMU", "#FanPulse", "#MUFC"],
}: FanSentimentCardProps) {
  const handleShare = async () => {
    const text = `${teamName} fans are feeling ${emoji} ${label} (${sentiment}%)! ${matchResult} ${hashtags.join(" ")}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Fan Pulse", text });
      } catch {}
    } else {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`bg-gradient-to-b ${getSentimentGradient(sentiment)}`}>
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[9px] gap-1">
              💓 FAN PULSE
            </Badge>
            <span className="text-[10px] text-muted-foreground">fanpulse.app</span>
          </div>

          {/* Team */}
          <div className="text-center space-y-1">
            <img
              src={getTeamLogo(shortName)}
              alt={shortName}
              className="w-12 h-12 object-contain mx-auto"
            />
            <p className="text-sm font-bold text-foreground uppercase tracking-wider">{teamName}</p>
            <p className="text-xs text-muted-foreground">Fans are feeling</p>
          </div>

          {/* Sentiment */}
          <motion.div
            className="text-center py-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="text-5xl block">{emoji}</span>
            <p className="text-3xl font-black text-foreground mt-1">{sentiment}%</p>
            <p className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</p>
          </motion.div>

          {/* Match context */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">{matchResult}</p>
            {highlights.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {highlights.map((h, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">
                    {i === 0 ? "🔥" : "⚡"} {h}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Hashtags */}
          <p className="text-center text-xs text-muted-foreground">{hashtags.join(" ")}</p>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-[10px] gap-1" onClick={handleShare}>
              <span className="font-bold">𝕏</span> Share to X
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-[10px] gap-1" onClick={handleShare}>
              <Share2 className="w-3 h-3" /> Share
            </Button>
            <Button variant="outline" size="sm" className="text-[10px] gap-1">
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
