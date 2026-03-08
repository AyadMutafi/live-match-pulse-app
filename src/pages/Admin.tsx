import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Activity } from "lucide-react";
import AdminCompetitions from "@/components/admin/AdminCompetitions";
import AdminTeamSources from "@/components/admin/AdminTeamSources";
import AdminWeeklySetup from "@/components/admin/AdminWeeklySetup";
import AdminLiveMonitor from "@/components/admin/AdminLiveMonitor";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">FAN PULSE ADMIN</h1>
          </div>
          <span className="text-xs text-muted-foreground">Sentiment Monitoring System</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="competitions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="competitions" className="flex items-center gap-1.5 text-xs py-2">
              <Trophy className="h-3.5 w-3.5" /> Competitions
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1.5 text-xs py-2">
              <Users className="h-3.5 w-3.5" /> Team Sources
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-1.5 text-xs py-2">
              <Calendar className="h-3.5 w-3.5" /> Weekly Setup
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-1.5 text-xs py-2">
              <Activity className="h-3.5 w-3.5" /> Live Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="competitions"><AdminCompetitions /></TabsContent>
          <TabsContent value="sources"><AdminTeamSources /></TabsContent>
          <TabsContent value="weekly"><AdminWeeklySetup /></TabsContent>
          <TabsContent value="monitor"><AdminLiveMonitor /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
