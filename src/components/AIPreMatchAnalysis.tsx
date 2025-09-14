import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Globe, TrendingUp, AlertTriangle, Star, Target } from "lucide-react";

interface PlayerAnalysis {
  name: string;
  position: string;
  formRating: number;
  keyStrengths: string[];
  concerns: string[];
  mediaScore: number;
}

interface TeamAnalysis {
  teamName: string;
  teamColor: string;
  overallForm: number;
  keyPlayers: PlayerAnalysis[];
  tactics: {
    formation: string;
    style: string;
    effectiveness: number;
  };
  strengths: string[];
  weaknesses: string[];
  expertOpinions: {
    source: string;
    quote: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  webSources: number;
  analysisConfidence: number;
}

interface AIPreMatchAnalysisProps {
  homeTeam: TeamAnalysis;
  awayTeam: TeamAnalysis;
  matchDate: string;
  competition: string;
}

export function AIPreMatchAnalysis({ homeTeam, awayTeam, matchDate, competition }: AIPreMatchAnalysisProps) {
  const getFormColor = (rating: number) => {
    if (rating >= 80) return "text-success";
    if (rating >= 60) return "text-warning";
    return "text-destructive";
  };

  const getFormEmoji = (rating: number) => {
    if (rating >= 90) return "🔥";
    if (rating >= 80) return "😍";
    if (rating >= 60) return "😐";
    if (rating >= 40) return "😑";
    return "🤬";
  };

  const renderTeamAnalysis = (team: TeamAnalysis, isHome: boolean) => (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: team.teamColor }}
          ></div>
          <h3 className="font-bold text-lg">{team.teamName}</h3>
          <span className="text-2xl">{getFormEmoji(team.overallForm)}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {team.overallForm}% Form
        </Badge>
      </div>

      {/* Key Players Analysis */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
          <Star className="w-4 h-4 text-primary" />
          <span>Key Players Intelligence</span>
        </h4>
        <div className="space-y-3">
          {team.keyPlayers.map((player, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-sm">{player.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({player.position})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getFormColor(player.formRating)}`}>
                    {player.formRating}%
                  </span>
                  <div className="w-2 h-2 bg-ai-green rounded-full"></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-success">
                  ✓ {player.keyStrengths.join(" • ")}
                </p>
                {player.concerns.length > 0 && (
                  <p className="text-xs text-destructive">
                    ⚠ {player.concerns.join(" • ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Analysis */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
          <Target className="w-4 h-4 text-accent" />
          <span>Tactical Setup</span>
        </h4>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{team.tactics.formation}</span>
            <Badge variant="outline" className="text-xs">
              {team.tactics.effectiveness}% effective
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{team.tactics.style}</p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">AI Team Assessment</h4>
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-success">Strengths:</span>
            <p className="text-xs text-muted-foreground">{team.strengths.join(" • ")}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-destructive">Vulnerabilities:</span>
            <p className="text-xs text-muted-foreground">{team.weaknesses.join(" • ")}</p>
          </div>
        </div>
      </div>

      {/* Expert Opinions */}
      <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
          <Globe className="w-4 h-4 text-primary" />
          <span>Expert Insights</span>
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {team.expertOpinions.map((opinion, index) => (
            <div key={index} className="p-2 bg-muted/50 rounded text-xs">
              <p className="italic text-muted-foreground mb-1">"{opinion.quote}"</p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">{opinion.source}</span>
                <div className={`w-2 h-2 rounded-full ${
                  opinion.sentiment === "positive" ? "bg-success" :
                  opinion.sentiment === "negative" ? "bg-destructive" : "bg-warning"
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-ai-green" />
            <span className="font-semibold text-sm">AI Pre-Match Intelligence</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-ai-green/10 text-ai-green">
              {homeTeam.webSources + awayTeam.webSources} Sources Analyzed
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Math.round((homeTeam.analysisConfidence + awayTeam.analysisConfidence) / 2)}% Confidence
            </Badge>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-foreground">{homeTeam.teamName} vs {awayTeam.teamName}</h2>
          <p className="text-sm text-muted-foreground">{competition} • {matchDate}</p>
        </div>

        <div className="p-3 bg-primary/5 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">AI Match Preview</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI has analyzed <strong>{homeTeam.webSources + awayTeam.webSources} web sources</strong> including expert articles, 
            professional opinions, and social media insights. {homeTeam.teamName} enters this match with 
            <strong className={getFormColor(homeTeam.overallForm)}> {homeTeam.overallForm}% form rating</strong>, 
            particularly strong in {homeTeam.strengths[0].toLowerCase()}. Meanwhile, {awayTeam.teamName} shows 
            <strong className={getFormColor(awayTeam.overallForm)}> {awayTeam.overallForm}% form</strong> with 
            tactical emphasis on {awayTeam.tactics.style.toLowerCase()}. Key battle expected between 
            {homeTeam.keyPlayers[0]?.name} and {awayTeam.keyPlayers[0]?.name}, with both players showing 
            exceptional recent performances. The match dynamics suggest {homeTeam.overallForm > awayTeam.overallForm ? homeTeam.teamName : awayTeam.teamName} 
            holds tactical advantage, though {homeTeam.overallForm < awayTeam.overallForm ? homeTeam.teamName : awayTeam.teamName}'s 
            {(homeTeam.overallForm < awayTeam.overallForm ? homeTeam.strengths[0] : awayTeam.strengths[0]).toLowerCase()} 
            could prove decisive. Professional analysts are particularly watching for 
            {homeTeam.overallForm > awayTeam.overallForm ? awayTeam.weaknesses[0] : homeTeam.weaknesses[0]} 
            exploitation in the opening phases.
          </p>
        </div>

        {(homeTeam.expertOpinions.length > 0 || awayTeam.expertOpinions.length > 0) && (
          <div className="p-3 bg-accent/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm">Expert Consensus</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>{Math.round(homeTeam.expertOpinions.filter(o => o.sentiment === "positive").length / homeTeam.expertOpinions.length * 100)}%</strong> of 
              experts favor {homeTeam.teamName}'s recent tactical adjustments, while 
              <strong> {Math.round(awayTeam.expertOpinions.filter(o => o.sentiment === "positive").length / awayTeam.expertOpinions.length * 100)}%</strong> highlight 
              {awayTeam.teamName}'s improved squad depth as a crucial factor.
            </p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderTeamAnalysis(homeTeam, true)}
        {renderTeamAnalysis(awayTeam, false)}
      </div>
    </div>
  );
}