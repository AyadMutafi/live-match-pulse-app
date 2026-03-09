import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, Check, X, Zap, Bell, Trophy, Globe, 
  TrendingUp, Share2, Swords, Clock, Star
} from "lucide-react";

interface ProValueScreenProps {
  onClose: () => void;
}

const features = [
  {
    name: "Clubs Tracked",
    free: "3 clubs",
    pro: "Unlimited",
    icon: Trophy,
  },
  {
    name: "Sentiment Refresh",
    free: "30 min delay",
    pro: "Real-time",
    icon: Clock,
  },
  {
    name: "Mood Cards",
    free: "Basic",
    pro: "Premium designs",
    icon: Share2,
  },
  {
    name: "Predictions",
    free: "1/week",
    pro: "Unlimited",
    icon: TrendingUp,
  },
  {
    name: "Rivalry Deep-dives",
    free: "Top 3",
    pro: "All rivalries",
    icon: Swords,
  },
  {
    name: "Sentiment Alerts",
    free: "None",
    pro: "Instant push",
    icon: Bell,
  },
  {
    name: "Languages",
    free: "English only",
    pro: "7 languages",
    icon: Globe,
  },
];

export function ProValueScreen({ onClose }: ProValueScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4"
          >
            <Crown className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground"
          >
            Fan Pulse Pro
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mt-2"
          >
            Get the complete fan intelligence experience
          </motion.p>
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="text-sm font-medium text-muted-foreground">Feature</div>
                <div className="text-sm font-medium text-muted-foreground">Free</div>
                <div className="text-sm font-medium text-primary flex items-center justify-center gap-1">
                  <Crown className="w-3 h-3" /> Pro
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border last:border-0 items-center"
                >
                  <div className="flex items-center gap-2">
                    <feature.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{feature.name}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">{feature.free}</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
                      {feature.pro}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Benefits */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 space-y-3"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" /> Why Go Pro?
          </h3>
          <div className="grid gap-2">
            {[
              "Track every club you love — no limits",
              "Real-time sentiment during live matches",
              "Be first to know when fan mood shifts",
              "Share premium mood cards to social",
              "Deep rivalry analytics and history",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-[hsl(var(--success))]" />
                {benefit}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 space-y-3"
        >
          <Button 
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
          >
            <Zap className="w-5 h-5" />
            Upgrade to Pro — $4.99/month
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            7-day free trial • Cancel anytime • Billed monthly
          </p>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onClose}
          >
            Maybe later
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] text-muted-foreground">
            Trusted by <span className="font-semibold text-foreground">12,000+</span> football fans worldwide
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            4.9 rating on App Store
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
