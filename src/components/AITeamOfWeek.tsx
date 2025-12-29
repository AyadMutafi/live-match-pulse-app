import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Sparkles } from "lucide-react";
import { useTeamOfWeek } from "@/hooks/useTeamOfWeek";
import { FieldFormation } from "./FieldFormation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialShareButtons } from "./SocialShareButtons";

const COMPETITIONS = [
  { 
    label: "Premier League", 
    value: "Premier League", 
    start: "2025-11-01", 
    end: "2025-11-07", 
    logo: "https://resources.premierleague.com/premierleague/photo/2023/11/14/1a1c7fbb-eca8-46aa-bb3e-80af61ec852c/Premier-League-Logo-2016.png"
  },
  { 
    label: "La Liga", 
    value: "La Liga", 
    start: "2025-11-01", 
    end: "2025-11-07", 
    logo: "https://assets.laliga.com/assets/logos/laliga-v/laliga-v-300x300.png"
  },
  { 
    label: "Serie A", 
    value: "Serie A", 
    start: "2025-11-01", 
    end: "2025-11-07", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lega_Serie_A_logo_2019.svg/200px-Lega_Serie_A_logo_2019.svg.png"
  },
  { 
    label: "Champions League", 
    value: "UEFA Champions League", 
    start: "2025-11-01", 
    end: "2025-11-07", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/UEFA_Champions_League_logo_2.svg/200px-UEFA_Champions_League_logo_2.svg.png"
  },
];

function CompetitionTeamOfWeek({ competition, competitionValue, weekStart, weekEnd }: { competition: string; competitionValue: string; weekStart: string; weekEnd: string }) {
  const { data, isLoading, error } = useTeamOfWeek(weekStart, weekEnd, competitionValue);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing matches...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Failed to load Team of the Week. {error.message}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={COMPETITIONS.find(c => c.label === competition)?.logo} 
            alt={competition}
            className="h-8 w-8 object-contain"
          />
          <h3 className="text-xl font-bold">{competition}</h3>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Based on {data?.matchesAnalyzed} matches analyzed (Nov 1 - 7, 2025)
        </div>
      </Card>

      {data?.teamOfWeek && (
        <FieldFormation 
          players={data.teamOfWeek.players} 
          formation={data.teamOfWeek.formation}
        />
      )}

      {data?.matchSummaries && data.matchSummaries.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            Analyzed Matches
          </h3>
          <div className="space-y-2 text-sm max-h-60 overflow-y-auto">
            {data.matchSummaries.map((summary: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span className="text-muted-foreground">{summary}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Share buttons */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-sm font-medium">Share this Team of the Week</span>
          <SocialShareButtons 
            title={`${competition} Team of the Week`}
            text={`🏆 Check out the AI-generated ${competition} Team of the Week! Based on ${data?.matchesAnalyzed || 0} matches analyzed. Who do you think deserved a spot?`}
            hashtags={["MatchPulse", "TeamOfTheWeek", competition.replace(/\s+/g, ''), "Football"]}
          />
        </div>
      </Card>
    </div>
  );
}

export function AITeamOfWeek() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">AI-Generated Team of the Week</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Select a competition to view the best performing players based on match data and fan sentiment
        </p>
      </Card>

      <Tabs defaultValue="premier-league" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {COMPETITIONS.map((comp, idx) => (
            <TabsTrigger key={idx} value={comp.label.toLowerCase().replace(/\s+/g, '-')} className="gap-2">
              <img 
                src={comp.logo} 
                alt={comp.label}
                className="h-4 w-4 object-contain"
              />
              <span className="hidden sm:inline">{comp.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {COMPETITIONS.map((comp, idx) => (
          <TabsContent key={idx} value={comp.label.toLowerCase().replace(/\s+/g, '-')}>
            <CompetitionTeamOfWeek 
              competition={comp.label}
              competitionValue={comp.value}
              weekStart={comp.start} 
              weekEnd={comp.end}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}