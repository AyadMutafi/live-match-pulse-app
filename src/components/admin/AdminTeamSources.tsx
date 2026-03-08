import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Hash, AtSign, Star, Megaphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SOURCE_ICONS: Record<string, any> = {
  official: AtSign,
  fanpage: Users,
  hashtag: Hash,
  influencer: Star,
};

const SOURCE_COLORS: Record<string, string> = {
  official: "text-blue-500",
  fanpage: "text-green-500",
  hashtag: "text-purple-500",
  influencer: "text-amber-500",
};

export default function AdminTeamSources() {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [newHandle, setNewHandle] = useState("");
  const [newType, setNewType] = useState<string>("official");

  const { data: teams = [] } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: sources = [] } = useQuery({
    queryKey: ["admin-sources", selectedTeamId],
    queryFn: async () => {
      if (!selectedTeamId) return [];
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("team_id", selectedTeamId)
        .order("source_type");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTeamId,
  });

  const addSource = useMutation({
    mutationFn: async () => {
      const isHashtag = newType === "hashtag";
      const { error } = await supabase.from("data_sources").insert({
        team_id: selectedTeamId,
        source_type: newType,
        handle: isHashtag ? null : newHandle.replace(/^@/, ""),
        hashtag: isHashtag ? (newHandle.startsWith("#") ? newHandle : `#${newHandle}`) : null,
        display_name: newHandle,
        platform: "twitter",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sources", selectedTeamId] });
      setNewHandle("");
      toast({ title: "Source added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteSource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("data_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sources", selectedTeamId] });
      toast({ title: "Source removed" });
    },
  });

  const selectedTeam = teams.find((t: any) => t.id === selectedTeamId);
  const grouped = {
    official: sources.filter((s: any) => s.source_type === "official"),
    fanpage: sources.filter((s: any) => s.source_type === "fanpage"),
    hashtag: sources.filter((s: any) => s.source_type === "hashtag"),
    influencer: sources.filter((s: any) => s.source_type === "influencer"),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Megaphone className="h-4 w-4 text-primary" /> Team Data Sources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team selector */}
        <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
          <SelectTrigger><SelectValue placeholder="Select a team..." /></SelectTrigger>
          <SelectContent>
            {teams.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTeam && (
          <>
            <div className="text-lg font-bold text-foreground">{selectedTeam.name} — Data Sources</div>

            {/* Add new source */}
            <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="w-36 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="official">Official Account</SelectItem>
                  <SelectItem value="fanpage">Fan Page</SelectItem>
                  <SelectItem value="hashtag">Hashtag</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder={newType === "hashtag" ? "#MUFC" : "@handle"}
                value={newHandle}
                onChange={e => setNewHandle(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={() => addSource.mutate()} disabled={!newHandle.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>

            {/* Sources grouped by type */}
            {(["official", "fanpage", "hashtag", "influencer"] as const).map(type => {
              const items = grouped[type];
              const Icon = SOURCE_ICONS[type];
              const colorClass = SOURCE_COLORS[type];
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                    {type === "official" ? "Official Accounts" : type === "fanpage" ? "Fan Pages" : type === "hashtag" ? "Hashtags" : "Influencers"}
                    <Badge variant="secondary" className="text-[10px] ml-1">{items.length}</Badge>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground pl-5">No {type}s configured</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 pl-5">
                      {items.map((s: any) => (
                        <div key={s.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-sm">
                          <span>{s.hashtag || `@${s.handle}`}</span>
                          <button onClick={() => deleteSource.mutate(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {!selectedTeamId && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Select a team to configure its X.com data sources (accounts, hashtags, influencers).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
