import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, X, Copy, Check } from "lucide-react";
import { getTeamLogo } from "@/lib/teamLogos";
import { getSentimentCategory } from "@/lib/constants";
import { toast } from "sonner";

interface ShareableMoodCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  homeSentiment: number;
  awaySentiment: number;
  matchMinute?: string;
  competition?: string;
  onClose: () => void;
}

export function ShareableMoodCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeSentiment,
  awaySentiment,
  matchMinute,
  competition,
  onClose,
}: ShareableMoodCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const homeCategory = getSentimentCategory(homeSentiment);
  const awayCategory = getSentimentCategory(awaySentiment);
  
  const total = homeSentiment + awaySentiment;
  const homePct = total > 0 ? Math.round((homeSentiment / total) * 100) : 50;
  const awayPct = 100 - homePct;

  const shareText = `⚽ ${homeTeam} ${homeScore ?? ""} vs ${awayTeam} ${awayScore ?? ""}\n\n${homeTeam} fans: ${homeCategory.emoji} ${homeSentiment}%\n${awayTeam} fans: ${awayCategory.emoji} ${awaySentiment}%\n\nWho's happier? Check Fan Pulse! 📡`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${homeTeam} vs ${awayTeam} - Fan Mood`,
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled or error
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        {/* Close button */}
        <div className="flex justify-end mb-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* The shareable card */}
        <Card 
          ref={cardRef}
          className="overflow-hidden bg-gradient-to-br from-card to-muted"
        >
          {/* Header */}
          <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📡</span>
              <span className="font-bold text-sm text-foreground">Fan Pulse</span>
            </div>
            {competition && (
              <Badge variant="outline" className="text-[9px]">
                {competition}
              </Badge>
            )}
          </div>

          <CardContent className="p-4 space-y-4">
            {/* Teams and Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={getTeamLogo(homeTeam)} 
                  alt={homeTeam}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">{homeTeam}</p>
                  {homeScore !== undefined && (
                    <p className="text-2xl font-bold text-foreground">{homeScore}</p>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                {matchMinute && (
                  <Badge variant="destructive" className="text-[10px] animate-pulse">
                    {matchMinute}'
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1">vs</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-sm text-foreground">{awayTeam}</p>
                  {awayScore !== undefined && (
                    <p className="text-2xl font-bold text-foreground">{awayScore}</p>
                  )}
                </div>
                <img 
                  src={getTeamLogo(awayTeam)} 
                  alt={awayTeam}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>

            {/* Sentiment comparison */}
            <div className="space-y-2">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">
                Fan Mood Battle
              </p>
              
              {/* Tug of war bar */}
              <div className="h-4 rounded-full bg-muted overflow-hidden flex">
                <motion.div
                  className="h-full bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(var(--success))]/70"
                  initial={{ width: "50%" }}
                  animate={{ width: `${homePct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-gradient-to-l from-primary to-primary/70"
                  initial={{ width: "50%" }}
                  animate={{ width: `${awayPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Sentiment details */}
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">{homeCategory.emoji}</span>
                    <span className="text-lg font-bold text-foreground">{homeSentiment}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{homeCategory.name}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-foreground">{awaySentiment}</span>
                    <span className="text-2xl">{awayCategory.emoji}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{awayCategory.name}</p>
                </div>
              </div>
            </div>

            {/* Branding */}
            <p className="text-[9px] text-center text-muted-foreground">
              Real-time fan sentiment • fanpulse.app
            </p>
          </CardContent>
        </Card>

        {/* Share buttons */}
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleTwitterShare}
            >
              <span className="font-bold">𝕏</span>
              Share
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20"
              onClick={handleWhatsAppShare}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleCopyText}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          
          <Button 
            className="w-full gap-2" 
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Mood Card
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
