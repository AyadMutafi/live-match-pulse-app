import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ProValueScreen } from "@/components/ProValueScreen";
import { AnimatePresence } from "framer-motion";
import {
  Trophy,
  BarChart3,
  Info,
  Settings,
  Crown,
  Shield,
  Share2,
} from "lucide-react";

export function MoreTab() {
  const navigate = useNavigate();
  const [showProScreen, setShowProScreen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Fan Pulse - Live Football Sentiment",
      text: "Track real-time fan mood for your favorite football clubs! 📡⚽",
      url: window.location.origin + "?utm_source=share&utm_medium=referral",
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  const menuItems = [
    {
      icon: Trophy,
      label: "League Standings",
      description: "Full table for all leagues",
      action: () => navigate("/league-ratings"),
    },
    {
      icon: BarChart3,
      label: "Weekly Ratings",
      description: "Player performance this week",
      action: () => navigate("/weekly"),
    },
    {
      icon: Crown,
      label: "Fan Pulse Pro",
      description: "Unlock unlimited features",
      badge: "PRO",
      action: () => setShowProScreen(true),
    },
    {
      icon: Share2,
      label: "Share Fan Pulse",
      description: "Invite friends to track fan mood",
      badge: "NEW",
      action: handleShare,
    },
    {
      icon: Info,
      label: "About Fan Pulse",
      description: "How it works",
      action: () => navigate("/about"),
    },
    {
      icon: Shield,
      label: "Admin Panel",
      description: "Manage data & sources",
      action: () => navigate("/admin"),
    },
  ];

  return (
    <>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-foreground">More</h2>

        <div className="space-y-2">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={item.action}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        {item.badge && (
                          <Badge className="text-[9px] px-1.5 py-0 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showProScreen && (
          <ProValueScreen onClose={() => setShowProScreen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
