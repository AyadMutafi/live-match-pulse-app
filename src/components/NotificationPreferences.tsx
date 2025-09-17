import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Clock, Smartphone, Mail, Globe } from "lucide-react";

interface NotificationSettings {
  pre_match_reminders: boolean;
  match_result_notifications: boolean;
  prediction_reminders: boolean;
  team_news_updates: boolean;
  live_match_updates: boolean;
  reminder_time_minutes: number;
}

export const NotificationPreferences = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pre_match_reminders: true,
    match_result_notifications: true,
    prediction_reminders: true,
    team_news_updates: false,
    live_match_updates: true,
    reminder_time_minutes: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const reminderTimeOptions = [
    { value: 15, label: "15 minutes before" },
    { value: 30, label: "30 minutes before" },
    { value: 60, label: "1 hour before" },
    { value: 120, label: "2 hours before" },
    { value: 1440, label: "1 day before" }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Customize how and when you receive notifications
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Match Notifications
            </CardTitle>
            <CardDescription>
              Control notifications for matches involving your favorite teams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pre-match-reminders" className="text-base">
                  Pre-match reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified before matches start
                </p>
              </div>
              <Switch
                id="pre-match-reminders"
                checked={settings.pre_match_reminders}
                onCheckedChange={(checked) => updateSetting('pre_match_reminders', checked)}
              />
            </div>

            {settings.pre_match_reminders && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="reminder-time" className="text-sm">
                  Reminder timing
                </Label>
                <Select
                  value={settings.reminder_time_minutes.toString()}
                  onValueChange={(value) => updateSetting('reminder_time_minutes', parseInt(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTimeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="live-match-updates" className="text-base">
                  Live match updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Real-time score updates during matches
                </p>
              </div>
              <Switch
                id="live-match-updates"
                checked={settings.live_match_updates}
                onCheckedChange={(checked) => updateSetting('live_match_updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="match-result-notifications" className="text-base">
                  Match results
                </Label>
                <p className="text-sm text-muted-foreground">
                  Final scores and match summaries
                </p>
              </div>
              <Switch
                id="match-result-notifications"
                checked={settings.match_result_notifications}
                onCheckedChange={(checked) => updateSetting('match_result_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Predictions & Insights
            </CardTitle>
            <CardDescription>
              AI-powered predictions and analysis notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prediction-reminders" className="text-base">
                  Prediction reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Reminders to make predictions before matches
                </p>
              </div>
              <Switch
                id="prediction-reminders"
                checked={settings.prediction_reminders}
                onCheckedChange={(checked) => updateSetting('prediction_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="team-news-updates" className="text-base">
                  Team news updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Important news about your favorite teams
                </p>
              </div>
              <Switch
                id="team-news-updates"
                checked={settings.team_news_updates}
                onCheckedChange={(checked) => updateSetting('team_news_updates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
};