import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Trophy, Flame, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BraggingMoment {
  id: string;
  type: "prediction_correct" | "early_call" | "streak" | "upset_called";
  team: string;
  opponent: string;
  yourConfidence: number;
  communityConfidence: number;
  result: string;
  timestamp: string;
  braggingText: string;
}

const mockMoments: BraggingMoment[] = [
  {
    id: "1",
    type: "upset_called",
    team: "Liverpool",
    opponent: "Manchester City",
    yourConfidence: 78,
    communityConfidence: 35,
    result: "3-1",
    timestamp: "Yesterday",
    braggingText: "Called it when nobody believed! 🔥"
  },
  {
    id: "2",
    type: "prediction_correct",
    team: "Arsenal",
    opponent: "Chelsea",
    yourConfidence: 82,
    communityConfidence: 68,
    result: "2-0",
    timestamp: "Dec 27",
    braggingText: "Gunners knew it all along! 💪"
  },
  {
    id: "3",
    type: "streak",
    team: "Real Madrid",
    opponent: "Various",
    yourConfidence: 85,
    communityConfidence: 72,
    result: "5 wins",
    timestamp: "This week",
    braggingText: "5 correct predictions in a row! 🏆"
  }
];

const getTypeConfig = (type: BraggingMoment["type"]) => {
  switch (type) {
    case "upset_called":
      return { 
        icon: Flame, 
        label: "UPSET CALLED", 
        gradient: "from-accent via-destructive to-accent",
        bgGradient: "from-accent/20 to-destructive/10"
      };
    case "prediction_correct":
      return { 
        icon: CheckCircle, 
        label: "NAILED IT", 
        gradient: "from-[hsl(var(--success))] via-primary to-[hsl(var(--success))]",
        bgGradient: "from-[hsl(var(--success))]/20 to-primary/10"
      };
    case "streak":
      return { 
        icon: Trophy, 
        label: "HOT STREAK", 
        gradient: "from-[hsl(var(--warning))] via-accent to-[hsl(var(--warning))]",
        bgGradient: "from-warning/20 to-accent/10"
      };
    case "early_call":
      return { 
        icon: TrendingUp, 
        label: "EARLY CALL", 
        gradient: "from-primary via-secondary to-primary",
        bgGradient: "from-primary/20 to-secondary/10"
      };
  }
};

export function BraggingCard() {
  const handleShare = (moment: BraggingMoment) => {
    const config = getTypeConfig(moment.type);
    const text = `🎯 ${config.label}!\n\n${moment.braggingText}\n\n${moment.team} ${moment.result} ${moment.opponent}\n\nMy confidence: ${moment.yourConfidence}%\nCommunity: ${moment.communityConfidence}%\n\n#FanPulse #CalledIt`;
    
    if (navigator.share) {
      navigator.share({
        title: "I Called It!",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard! Share your win!");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[hsl(var(--warning))]" />
          <span className="font-semibold text-sm">Your Bragging Rights</span>
        </div>
        <Badge variant="outline" className="border-[hsl(var(--success))]/50 text-[hsl(var(--success))] text-xs">
          {mockMoments.length} moments
        </Badge>
      </div>

      {/* Moments */}
      <div className="space-y-3">
        {mockMoments.map((moment, index) => {
          const config = getTypeConfig(moment.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient}`}>
                {/* Decorative gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20 blur-xl`} />
                
                <div className="relative p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full bg-gradient-to-r ${config.gradient}`}>
                        <Icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <Badge className={`text-[10px] bg-gradient-to-r ${config.gradient} text-primary-foreground border-0`}>
                        {config.label}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{moment.timestamp}</span>
                  </div>

                  {/* Match Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{moment.team}</span>
                      <span className="text-muted-foreground text-sm">{moment.result}</span>
                      <span className="font-medium text-sm">{moment.opponent}</span>
                    </div>
                    <p className="text-sm text-foreground/80">{moment.braggingText}</p>
                  </div>

                  {/* Confidence Comparison */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Your Confidence</p>
                      <p className="text-xl font-bold text-[hsl(var(--success))]">{moment.yourConfidence}%</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Community</p>
                      <p className="text-xl font-bold text-muted-foreground">{moment.communityConfidence}%</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className={`flex-1 bg-gradient-to-r ${config.gradient} hover:opacity-90`}
                      size="sm"
                      onClick={() => handleShare(moment)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share Win
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state / motivation */}
      {mockMoments.length === 0 && (
        <Card className="p-6 text-center border-dashed">
          <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">No bragging rights yet!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Make predictions to earn your first shareable moment
          </p>
        </Card>
      )}
    </div>
  );
}
