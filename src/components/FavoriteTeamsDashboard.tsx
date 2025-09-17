import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Star, StarOff, Calendar, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Team {
  id: string;
  name: string;
  league: string;
  country: string;
}

interface FavoriteTeam extends Team {
  is_primary: boolean;
  created_at: string;
}

export const FavoriteTeamsDashboard = () => {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchFavoriteTeams();
    fetchAvailableTeams();
  }, []);

  const fetchFavoriteTeams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorite_teams')
        .select(`
          *,
          teams!inner(
            id,
            name,
            league,
            country
          )
        `)
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        id: item.teams?.id || '',
        name: item.teams?.name || '',
        league: item.teams?.league || '',
        country: item.teams?.country || '',
        is_primary: item.is_primary || false,
        created_at: item.created_at
      })) || [];

      setFavoriteTeams(formattedData);
    } catch (error) {
      toast.error("Failed to fetch favorite teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) throw error;
      setAvailableTeams(data || []);
    } catch (error) {
      toast.error("Failed to fetch teams");
    }
  };

  const addFavoriteTeam = async (teamId: string, isPrimary = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // If setting as primary, first remove primary status from other teams
      if (isPrimary) {
        await supabase
          .from('user_favorite_teams')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('user_favorite_teams')
        .insert({
          user_id: user.id,
          team_id: teamId,
          is_primary: isPrimary
        });

      if (error) throw error;

      toast.success("Team added to favorites!");
      fetchFavoriteTeams();
      setAddDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add favorite team");
    }
  };

  const removeFavoriteTeam = async (teamId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_favorite_teams')
        .delete()
        .eq('user_id', user.id)
        .eq('team_id', teamId);

      if (error) throw error;

      toast.success("Team removed from favorites");
      fetchFavoriteTeams();
    } catch (error) {
      toast.error("Failed to remove favorite team");
    }
  };

  const setPrimaryTeam = async (teamId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove primary status from all teams
      await supabase
        .from('user_favorite_teams')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set the selected team as primary
      const { error } = await supabase
        .from('user_favorite_teams')
        .update({ is_primary: true })
        .eq('user_id', user.id)
        .eq('team_id', teamId);

      if (error) throw error;

      toast.success("Primary team updated!");
      fetchFavoriteTeams();
    } catch (error) {
      toast.error("Failed to update primary team");
    }
  };

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteTeamIds = favoriteTeams.map(team => team.id);
  const availableToAdd = filteredTeams.filter(team => !favoriteTeamIds.includes(team.id));

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Favorite Teams</h2>
          <p className="text-muted-foreground">
            Manage your favorite teams for personalized content
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Favorite Team</DialogTitle>
              <DialogDescription>
                Search and add teams to your favorites list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams, leagues, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableToAdd.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                  >
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.league} • {team.country}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addFavoriteTeam(team.id, false)}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addFavoriteTeam(team.id, true)}
                      >
                        Add as Primary
                      </Button>
                    </div>
                  </div>
                ))}
                {availableToAdd.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No teams found matching your search" : "All teams already added"}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {favoriteTeams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No Favorite Teams Yet</CardTitle>
            <CardDescription className="mb-4">
              Add your favorite teams to get personalized content and predictions
            </CardDescription>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTeams.map((team) => (
            <Card key={team.id} className="relative">
              {team.is_primary && (
                <Badge className="absolute -top-2 -right-2 bg-accent">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </Badge>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <CardDescription>
                  {team.league} • {team.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {!team.is_primary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimaryTeam(team.id)}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Set Primary
                      </Button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFavoriteTeam(team.id)}
                  >
                    <StarOff className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};