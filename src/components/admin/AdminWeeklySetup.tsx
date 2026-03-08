import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Plus, Link, Settings, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminWeeklySetup() {
  const queryClient = useQueryClient();
  const [selectedComp, setSelectedComp] = useState("");
  const [weekNumber, setWeekNumber] = useState("1");
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("15:00");

  const { data: competitions = [] } = useQuery({
    queryKey: ["admin-competitions"],
    queryFn: async () => {
      const { data } = await supabase.from("competitions").select("*").order("name");
      return data || [];
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*").order("name");
      return data || [];
    },
  });

  const { data: monitoring = [] } = useQuery({
    queryKey: ["admin-monitoring", selectedComp, weekNumber],
    queryFn: async () => {
      if (!selectedComp) return [];
      const { data } = await supabase
        .from("match_monitoring")
        .select("*, matches(*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name))")
        .eq("competition_slug", selectedComp)
        .eq("week_number", parseInt(weekNumber))
        .order("created_at");
      return data || [];
    },
    enabled: !!selectedComp,
  });

  // Count sources per team
  const { data: sourceCounts = {} } = useQuery({
    queryKey: ["admin-source-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("data_sources").select("team_id");
      const counts: Record<string, number> = {};
      (data || []).forEach((s: any) => { counts[s.team_id] = (counts[s.team_id] || 0) + 1; });
      return counts;
    },
  });

  const addMatch = useMutation({
    mutationFn: async () => {
      const dateTime = new Date(`${matchDate}T${matchTime}:00`).toISOString();
      const comp = competitions.find((c: any) => c.slug === selectedComp);
      // Create match
      const { data: match, error: mErr } = await supabase.from("matches").insert({
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        match_date: dateTime,
        competition: comp?.name || selectedComp,
        status: "scheduled",
      }).select().single();
      if (mErr) throw mErr;

      // Create monitoring config
      const start = new Date(dateTime);
      start.setMinutes(start.getMinutes() - 30);
      const end = new Date(dateTime);
      end.setHours(end.getHours() + 3);

      const { error: monErr } = await supabase.from("match_monitoring").insert({
        match_id: match.id,
        competition_slug: selectedComp,
        week_number: parseInt(weekNumber),
        monitoring_start: start.toISOString(),
        monitoring_end: end.toISOString(),
        active: false,
      });
      if (monErr) throw monErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-monitoring"] });
      setShowAddMatch(false);
      setHomeTeamId(""); setAwayTeamId(""); setMatchDate(""); setMatchTime("15:00");
      toast({ title: "Match added to weekly setup" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("match_monitoring").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-monitoring"] }),
  });

  const deleteMonitoring = useMutation({
    mutationFn: async ({ monId, matchId }: { monId: string; matchId: string }) => {
      await supabase.from("match_monitoring").delete().eq("id", monId);
      await supabase.from("matches").delete().eq("id", matchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-monitoring"] });
      toast({ title: "Removed" });
    },
  });

  const selectedCompObj = competitions.find((c: any) => c.slug === selectedComp);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" /> Weekly Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Select value={selectedComp} onValueChange={setSelectedComp}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Competition..." /></SelectTrigger>
            <SelectContent>
              {competitions.map((c: any) => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Week</span>
            <Input
              type="number" min={1} max={50} value={weekNumber}
              onChange={e => setWeekNumber(e.target.value)}
              className="w-20 text-sm"
            />
          </div>
        </div>

        {selectedComp && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {selectedCompObj?.name} — Week {weekNumber}
              </h3>
              <Button size="sm" variant="outline" onClick={() => setShowAddMatch(!showAddMatch)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Match
              </Button>
            </div>

            {showAddMatch && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Home Team" /></SelectTrigger>
                    <SelectContent>
                      {teams.map((t: any) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Away Team" /></SelectTrigger>
                    <SelectContent>
                      {teams.map((t: any) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="text-sm" />
                  <Input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="text-sm w-28" />
                  <Button size="sm" onClick={() => addMatch.mutate()} disabled={!homeTeamId || !awayTeamId || !matchDate}>
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Match list */}
            <div className="space-y-2">
              {monitoring.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No matches configured for this week.</p>
              ) : (
                monitoring.map((m: any) => {
                  const match = m.matches;
                  const homeName = match?.home_team?.name || "Home";
                  const awayName = match?.away_team?.name || "Away";
                  const homeSourceCount = (sourceCounts as any)[match?.home_team_id] || 0;
                  const awaySourceCount = (sourceCounts as any)[match?.away_team_id] || 0;
                  const totalSources = homeSourceCount + awaySourceCount;
                  const kickoff = match?.match_date ? new Date(match.match_date).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "TBD";

                  return (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{homeName} vs {awayName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{kickoff}</span>
                          <Badge variant="outline" className="text-[10px]">
                            <Link className="h-2.5 w-2.5 mr-0.5" /> {totalSources} sources
                          </Badge>
                          {m.active && <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">ACTIVE</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={m.active} onCheckedChange={active => toggleActive.mutate({ id: m.id, active })} />
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteMonitoring.mutate({ monId: m.id, matchId: m.match_id })}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {monitoring.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="default" onClick={() => {
                  monitoring.forEach((m: any) => toggleActive.mutate({ id: m.id, active: true }));
                }}>
                  Activate All
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  monitoring.forEach((m: any) => toggleActive.mutate({ id: m.id, active: false }));
                }}>
                  Deactivate All
                </Button>
              </div>
            )}
          </>
        )}

        {!selectedComp && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Select a competition to configure weekly matches and activate monitoring.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
