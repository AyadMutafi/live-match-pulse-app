import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Swords, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Rivalry {
  id: string;
  favorite_team_id: string;
  rival_team_id: string;
  wins: number;
  losses: number;
  draws: number;
  intensity_score: number;
  favorite_team_name?: string;
  rival_team_name?: string;
}

export function TeamRivalryTracker() {
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRivalries();
  }, []);

  const fetchRivalries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's favorite teams
      const { data: favTeams } = await supabase
        .from('user_favorite_teams')
        .select('team_id, teams!inner(name)')
        .eq('user_id', user.id);

      if (!favTeams || favTeams.length === 0) {
        setLoading(false);
        return;
      }

      // Get rivalries
      const { data: rivalriesData, error } = await supabase
        .from('team_rivalries')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Fetch team names for rivalries
      const enrichedRivalries = await Promise.all(
        (rivalriesData || []).map(async (rivalry) => {
          const favTeam = favTeams.find((t: any) => t.team_id === rivalry.favorite_team_id);
          
          const { data: rivalTeam } = await supabase
            .from('teams')
            .select('name')
            .eq('id', rivalry.rival_team_id)
            .single();

          return {
            ...rivalry,
            favorite_team_name: (favTeam as any)?.teams?.name,
            rival_team_name: rivalTeam?.name,
          };
        })
      );

      setRivalries(enrichedRivalries);
    } catch (error) {
      toast.error("Failed to load rivalries");
    } finally {
      setLoading(false);
    }
  };

  const getRivalryRecord = (rivalry: Rivalry) => {
    const total = rivalry.wins + rivalry.losses + rivalry.draws;
    const winRate = total > 0 ? Math.round((rivalry.wins / total) * 100) : 0;
    return { total, winRate };
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "text-red-500";
    if (intensity >= 60) return "text-orange-500";
    if (intensity >= 40) return "text-yellow-500";
    return "text-blue-500";
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Team Rivalries
            </CardTitle>
            <CardDescription>
              Track your team's performance against rivals
            </CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Rivalry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rivalries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No rivalries tracked yet</p>
            <p className="text-sm mt-2">Add rival teams to track head-to-head records</p>
          </div>
        ) : (
          rivalries.map((rivalry) => {
            const { total, winRate } = getRivalryRecord(rivalry);
            return (
              <div
                key={rivalry.id}
                className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">
                        {rivalry.favorite_team_name}
                      </h4>
                      <span className="text-muted-foreground">vs</span>
                      <h4 className="font-semibold text-destructive">
                        {rivalry.rival_team_name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Record: {rivalry.wins}W - {rivalry.draws}D - {rivalry.losses}L</span>
                      <Badge variant="outline" className={getIntensityColor(rivalry.intensity_score)}>
                        Intensity: {rivalry.intensity_score}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {winRate >= 50 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Win Rate</span>
                    <span className="font-semibold">{winRate}%</span>
                  </div>
                  <Progress value={winRate} className="h-2" />
                </div>

                {total > 0 && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-green-500/10 rounded">
                      <div className="font-bold text-green-500">{rivalry.wins}</div>
                      <div className="text-muted-foreground">Wins</div>
                    </div>
                    <div className="p-2 bg-yellow-500/10 rounded">
                      <div className="font-bold text-yellow-500">{rivalry.draws}</div>
                      <div className="text-muted-foreground">Draws</div>
                    </div>
                    <div className="p-2 bg-red-500/10 rounded">
                      <div className="font-bold text-red-500">{rivalry.losses}</div>
                      <div className="text-muted-foreground">Losses</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
