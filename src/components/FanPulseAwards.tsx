import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { getMockAwards, getSentimentEmoji } from "@/lib/fanRatings";

export function FanPulseAwards() {
  const awards = getMockAwards();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <Trophy className="w-10 h-10 text-primary mx-auto mb-2" />
        <h2 className="text-xl font-black text-foreground">FAN PULSE AWARDS 2024</h2>
        <p className="text-sm text-muted-foreground mt-1">
          100% determined by fan sentiments — no journalists, no votes, just pure fan feelings
        </p>
      </div>

      {/* Awards */}
      {awards.map((award, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{award.emoji}</span>
              <h3 className="font-bold text-sm uppercase text-foreground">{award.title}</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">{getSentimentEmoji(award.value)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">🥇</Badge>
                  <span className="font-bold text-foreground">{award.playerName}</span>
                </div>
                <p className="text-xs text-muted-foreground">{award.teamName}</p>
                <p className="text-sm font-semibold text-primary mt-1">{award.stat}</p>
                {award.change && (
                  <Badge
                    variant="outline"
                    className={`text-xs mt-1 ${
                      award.change.startsWith("+") ? "text-emerald-500" : "text-destructive"
                    }`}
                  >
                    {award.change} sentiment
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 italic">
              "{award.description}"
            </p>
          </Card>
        </motion.div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-1" />
          Share Your Favorites
        </Button>
      </div>
    </div>
  );
}
