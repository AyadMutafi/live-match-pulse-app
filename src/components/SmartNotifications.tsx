import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  BellRing, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Flame, 
  Users,
  Zap,
  Settings2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  threshold?: number;
}

export function SmartNotifications() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "sentiment_change",
      title: "Dramatic Sentiment Changes",
      description: "Alert when your team's sentiment changes by more than 20%",
      icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
      enabled: true,
      threshold: 20,
    },
    {
      id: "rival_panic",
      title: "Rival is Panicking",
      description: "Get notified when rival fans' confidence drops significantly",
      icon: <Users className="h-5 w-5 text-red-500" />,
      enabled: true,
      threshold: 30,
    },
    {
      id: "pre_match_hype",
      title: "Pre-Match Hype",
      description: "Join discussions when fans are building up excitement",
      icon: <Flame className="h-5 w-5 text-yellow-500" />,
      enabled: true,
      threshold: 70,
    },
    {
      id: "goal_sentiment",
      title: "Goal Alerts with Sentiment",
      description: "See how fan mood changes after goals",
      icon: <Target className="h-5 w-5 text-green-500" />,
      enabled: true,
    },
    {
      id: "var_drama",
      title: "VAR Drama Alerts",
      description: "Get notified during controversial VAR decisions",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      enabled: false,
    },
    {
      id: "trending_player",
      title: "Trending Player Alerts",
      description: "When a player is suddenly being talked about",
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      enabled: true,
    },
  ]);

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: "1",
      type: "goal_sentiment",
      title: "GOAL! Fans went from 😰 to 🔥",
      description: "Liverpool scored! Fan sentiment jumped 47%",
      time: "2 min ago",
    },
    {
      id: "2",
      type: "rival_panic",
      title: "Man United fans panicking!",
      description: "Rival confidence dropped to 28%",
      time: "15 min ago",
    },
    {
      id: "3",
      type: "pre_match_hype",
      title: "Pre-match buzz: 73% confident",
      description: "Fans are hyped for Barcelona vs Real Madrid",
      time: "1 hour ago",
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
    toast({
      title: "Notification Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const updateThreshold = (id: string, value: number) => {
    setSettings(prev => 
      prev.map(s => s.id === id ? { ...s, threshold: value } : s)
    );
  };

  const clearAllAlerts = () => {
    setRecentAlerts([]);
    toast({
      title: "Alerts Cleared",
      description: "All recent alerts have been dismissed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Smart Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Smart Notification Settings
            </CardTitle>
            <Badge variant="secondary">
              {settings.filter(s => s.enabled).length} active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Get notified about what matters most to you
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                setting.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${setting.enabled ? "bg-background" : "bg-muted"}`}>
                    {setting.icon}
                  </div>
                  <div>
                    <Label className="font-semibold">{setting.title}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
              </div>
              
              {setting.threshold !== undefined && setting.enabled && (
                <div className="mt-4 pl-12">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Sensitivity Threshold</span>
                    <span className="font-mono">{setting.threshold}%</span>
                  </div>
                  <Slider
                    value={[setting.threshold]}
                    onValueChange={([value]) => updateThreshold(setting.id, value)}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Recent Smart Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearAllAlerts}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent alerts</p>
              <p className="text-sm">You'll see notifications here when events happen</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => {
                const setting = settings.find(s => s.id === alert.type);
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="p-2 bg-background rounded-lg">
                      {setting?.icon || <Bell className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
