import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Trophy, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminCompetitions() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: competitions = [], isLoading } = useQuery({
    queryKey: ["admin-competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const slug = newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("competitions").insert({
        name: newName, slug, country: newCountry || null, season: "2024/25",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competitions"] });
      setNewName(""); setNewCountry(""); setShowAdd(false);
      toast({ title: "Competition added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("competitions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competitions"] });
      toast({ title: "Deleted" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("competitions").update({ name, slug }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-competitions"] });
      setEditId(null);
      toast({ title: "Updated" });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-primary" /> Competitions
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAdd && (
          <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <Input placeholder="Competition name" value={newName} onChange={e => setNewName(e.target.value)} className="text-sm" />
            <Input placeholder="Country" value={newCountry} onChange={e => setNewCountry(e.target.value)} className="text-sm w-32" />
            <Button size="sm" onClick={() => addMutation.mutate()} disabled={!newName.trim()}>Save</Button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : competitions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No competitions yet. Add one to get started.</p>
        ) : (
          <div className="space-y-2">
            {competitions.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                {editId === c.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="text-sm h-8" />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateMutation.mutate({ id: c.id, name: editName })}>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium text-sm text-foreground">{c.name}</span>
                      {c.country && <Badge variant="secondary" className="ml-2 text-[10px]">{c.country}</Badge>}
                      <Badge variant="outline" className="ml-2 text-[10px]">{c.season || "2024/25"}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditId(c.id); setEditName(c.name); }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteMutation.mutate(c.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
