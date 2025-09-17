import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, Calendar, Clock, Bell, BellOff } from "lucide-react";
import { EnhancedPrediction } from "./EnhancedPrediction";
import { PredictionCard } from "./PredictionCard";
import { toast } from "sonner";

interface PersonalizedMatch {
  id: string;
  home_team: {
    name: string;
    id: string;
  };
  away_team: {
    name: string;
    id: string;
  };
  match_date: string;
  status: string;
  competition: string;
  is_favorite_match: boolean;
  reminder_set: boolean;
}

interface PersonalizedPrediction {
  homeTeam: string;
  awayTeam: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  aiInsight: string;
  is_personalized: boolean;
}

export const PersonalizedFeed = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<PersonalizedMatch[]>([]);
  const [personalizedPredictions, setPersonalizedPredictions] = useState<PersonalizedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("matches");

  useEffect(() => {
    fetchPersonalizedContent();
  }, []);

  const fetchPersonalizedContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch favorite teams first
      const { data: favoriteTeams } = await supabase
        .from('user_favorite_teams')
        .select('team_id')
        .eq('user_id', user.id);

      const favoriteTeamIds = favoriteTeams?.map(ft => ft.team_id) || [];

      if (favoriteTeamIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch upcoming matches for favorite teams
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name),
          away_team:teams!matches_away_team_id_fkey(id, name)
        `)
        .or(`home_team_id.in.(${favoriteTeamIds.join(',')}),away_team_id.in.(${favoriteTeamIds.join(',')})`)
        .gte('match_date', new Date().toISOString())
        .order('match_date')
        .limit(10);

      if (matchesError) throw matchesError;

      // Check for existing reminders
      const { data: reminders } = await supabase
        .from('match_reminders')
        .select('match_id')
        .eq('user_id', user.id);

      const reminderMatchIds = reminders?.map(r => r.match_id) || [];

      const formattedMatches = matches?.map(match => ({
        id: match.id,
        home_team: match.home_team,
        away_team: match.away_team,
        match_date: match.match_date,
        status: match.status,
        competition: match.competition,
        is_favorite_match: favoriteTeamIds.includes(match.home_team_id) || favoriteTeamIds.includes(match.away_team_id),
        reminder_set: reminderMatchIds.includes(match.id)
      })) || [];

      setUpcomingMatches(formattedMatches);

      // Generate personalized predictions (mock data for now)
      const mockPredictions = formattedMatches.slice(0, 5).map(match => ({
        homeTeam: match.home_team.name,
        awayTeam: match.away_team.name,
        homeWin: Math.floor(Math.random() * 40) + 30,
        draw: Math.floor(Math.random() * 20) + 20,
        awayWin: Math.floor(Math.random() * 40) + 20,
        confidence: Math.floor(Math.random() * 30) + 70,
        aiInsight: `Based on your favorite team preferences and recent form analysis, this match shows strong potential for an engaging contest.`,
        is_personalized: true
      }));

      setPersonalizedPredictions(mockPredictions);
    } catch (error) {
      toast.error("Failed to load personalized content");
    } finally {
      setLoading(false);
    }
  };

  const toggleMatchReminder = async (matchId: string, currentStatus: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (currentStatus) {
        // Remove reminder
        const { error } = await supabase
          .from('match_reminders')
          .delete()
          .eq('user_id', user.id)
          .eq('match_id', matchId);

        if (error) throw error;
        toast.success("Reminder removed");
      } else {
        // Add reminder
        const match = upcomingMatches.find(m => m.id === matchId);
        if (!match) return;

        const { data: preferences } = await supabase
          .from('notification_preferences')
          .select('reminder_time_minutes')
          .eq('user_id', user.id)
          .single();

        const reminderMinutes = preferences?.reminder_time_minutes || 60;
        const matchDate = new Date(match.match_date);
        const reminderTime = new Date(matchDate.getTime() - (reminderMinutes * 60 * 1000));

        const { error } = await supabase
          .from('match_reminders')
          .insert({
            user_id: user.id,
            match_id: matchId,
            scheduled_time: reminderTime.toISOString()
          });

        if (error) throw error;
        toast.success("Reminder set");
      }

      // Update local state
      setUpcomingMatches(prev =>
        prev.map(match =>
          match.id === matchId
            ? { ...match, reminder_set: !currentStatus }
            : match
        )
      );
    } catch (error) {
      toast.error("Failed to update reminder");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Your Personalized Feed</h2>
        <p className="text-muted-foreground">
          Customized content based on your favorite teams and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">Upcoming Matches</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="insights">Team Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4">
          {upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Upcoming Matches</CardTitle>
                <CardDescription>
                  Add favorite teams to see their upcoming matches here
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            upcomingMatches.map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {match.home_team.name} vs {match.away_team.name}
                      </CardTitle>
                      {match.is_favorite_match && (
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          Favorite
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMatchReminder(match.id, match.reminder_set)}
                    >
                      {match.reminder_set ? (
                        <BellOff className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(match.match_date)}
                    </span>
                    <Badge variant="outline">{match.competition}</Badge>
                    <Badge 
                      variant={match.status === "LIVE" ? "destructive" : "secondary"}
                    >
                      {match.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {personalizedPredictions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Predictions Available</CardTitle>
                <CardDescription>
                  Predictions will appear when matches are scheduled for your favorite teams
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            personalizedPredictions.map((prediction, index) => (
              <PredictionCard
                key={index}
                homeTeam={prediction.homeTeam}
                awayTeam={prediction.awayTeam}
                homeWin={prediction.homeWin}
                draw={prediction.draw}
                awayWin={prediction.awayWin}
                confidence={prediction.confidence}
                aiInsight={prediction.aiInsight}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">Team Insights Coming Soon</CardTitle>
              <CardDescription>
                AI-powered insights about your favorite teams will be available here
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};