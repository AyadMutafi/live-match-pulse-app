import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFanProfile, useUpdateFanProfile, getFanBadge } from "@/hooks/useFanProfile";
import { Trophy, Target, Flame, Eye, TrendingUp, Sparkles } from "lucide-react";

export function FanProfileCard() {
  const { data: profile, isLoading } = useFanProfile();
  const updateProfile = useUpdateFanProfile();

  if (isLoading) {
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

  if (!profile) return null;

  const fanBadge = getFanBadge(profile.fan_level);
  const pointsToNextLevel = ((profile.fan_level + 1) * 100) - profile.fan_points;
  const levelProgress = (profile.fan_points % 100);
  const predictionAccuracy = profile.total_predictions > 0 
    ? Math.round((profile.correct_predictions / profile.total_predictions) * 100)
    : 0;

  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{fanBadge.icon}</span>
              <span>Fan Profile</span>
            </CardTitle>
            <CardDescription>Your journey as a super fan</CardDescription>
          </div>
          <Badge className={`${fanBadge.color} text-lg px-3 py-1`}>
            Level {profile.fan_level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fan Badge */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className={`text-4xl mb-2 ${fanBadge.color}`}>{fanBadge.icon}</div>
          <h3 className="font-bold text-lg">{fanBadge.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {pointsToNextLevel} points to next level
          </p>
          <Progress value={levelProgress} className="mt-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs">Points</span>
            </div>
            <p className="text-2xl font-bold">{profile.fan_points}</p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Accuracy</span>
            </div>
            <p className="text-2xl font-bold">{predictionAccuracy}%</p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs">Streak</span>
            </div>
            <p className="text-2xl font-bold">{profile.engagement_streak}</p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Watched</span>
            </div>
            <p className="text-2xl font-bold">{profile.matches_watched}</p>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Reactions</span>
            <span className="font-semibold">{profile.total_reactions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Predictions Made</span>
            <span className="font-semibold">{profile.total_predictions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loyalty Score</span>
            <div className="flex items-center gap-2">
              <Progress value={profile.team_loyalty_score} className="w-20 h-2" />
              <span className="font-semibold">{profile.team_loyalty_score}%</span>
            </div>
          </div>
        </div>

        {/* Team Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <Label htmlFor="team-theme" className="cursor-pointer">
              Team Colors Theme
            </Label>
          </div>
          <Switch
            id="team-theme"
            checked={profile.team_theme_enabled}
            onCheckedChange={(checked) => 
              updateProfile.mutate({ team_theme_enabled: checked })
            }
          />
        </div>

        {/* Achievement Hints */}
        {profile.fan_level < 5 && (
          <div className="text-xs text-muted-foreground bg-accent/10 p-3 rounded-lg">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Make predictions and react to matches to earn points and unlock rewards!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
