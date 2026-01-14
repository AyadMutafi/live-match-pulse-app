import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, TrendingUp, TrendingDown, Calendar, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { CLUB_RIVALRIES, getSentimentCategory, getClubInfo } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { Link } from "react-router-dom";

interface RivalryData {
  name: string;
  clubs: readonly [string, string] | readonly string[];
  clubA: {
    name: string;
    sentiment: number;
    trend: number;
    mentions: number;
  };
  clubB: {
    name: string;
    sentiment: number;
    trend: number;
    mentions: number;
  };
  nextMatch?: {
    date: string;
    location: string;
  };
}

// Mock data - will be replaced with real API data
const mockRivalries: RivalryData[] = [
  {
    name: "El Clásico",
    clubs: ["FC Barcelona", "Real Madrid CF"],
    clubA: { name: "FC Barcelona", sentiment: 78, trend: 3, mentions: 52300 },
    clubB: { name: "Real Madrid CF", sentiment: 72, trend: 2, mentions: 48700 },
    nextMatch: { date: "Oct 26, 2025 at 21:00", location: "Camp Nou" }
  },
  {
    name: "Manchester Derby",
    clubs: ["Manchester City FC", "Manchester United FC"],
    clubA: { name: "Manchester City FC", sentiment: 75, trend: 1, mentions: 45600 },
    clubB: { name: "Manchester United FC", sentiment: 45, trend: -8, mentions: 72100 },
    nextMatch: { date: "Nov 3, 2025 at 16:30", location: "Old Trafford" }
  },
  {
    name: "North-West Derby",
    clubs: ["Liverpool FC", "Manchester United FC"],
    clubA: { name: "Liverpool FC", sentiment: 82, trend: 5, mentions: 61200 },
    clubB: { name: "Manchester United FC", sentiment: 45, trend: -8, mentions: 72100 },
    nextMatch: { date: "Dec 1, 2025 at 14:00", location: "Anfield" }
  },
  {
    name: "Title Race Clash",
    clubs: ["Liverpool FC", "Manchester City FC"],
    clubA: { name: "Liverpool FC", sentiment: 82, trend: 5, mentions: 61200 },
    clubB: { name: "Manchester City FC", sentiment: 75, trend: 1, mentions: 45600 },
    nextMatch: { date: "Jan 5, 2026 at 16:30", location: "Etihad Stadium" }
  }
];

function RivalryCard({ rivalry }: { rivalry: RivalryData }) {
  const clubAInfo = getClubInfo(rivalry.clubA.name);
  const clubBInfo = getClubInfo(rivalry.clubB.name);
  const clubALogo = getTeamLogo(clubAInfo?.shortName || rivalry.clubA.name);
  const clubBLogo = getTeamLogo(clubBInfo?.shortName || rivalry.clubB.name);
  
  const categoryA = getSentimentCategory(rivalry.clubA.sentiment);
  const categoryB = getSentimentCategory(rivalry.clubB.sentiment);
  
  const TrendIconA = rivalry.clubA.trend > 0 ? TrendingUp : TrendingDown;
  const TrendIconB = rivalry.clubB.trend > 0 ? TrendingUp : TrendingDown;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Swords className="w-4 h-4 text-destructive" />
            {rivalry.name}
          </CardTitle>
          <Link 
            to={`/rivalry/${rivalry.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Full Analysis
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Club Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Club A */}
          <div className="text-center space-y-2">
            <img 
              src={clubALogo} 
              alt={rivalry.clubA.name} 
              className="w-10 h-10 mx-auto object-contain"
            />
            <p className="text-xs font-medium truncate">{clubAInfo?.shortName || rivalry.clubA.name}</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold">{rivalry.clubA.sentiment}</span>
              <span>{categoryA.emoji}</span>
              <TrendIconA className={`w-3 h-3 ${rivalry.clubA.trend > 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`} />
              <span className={`text-[10px] ${rivalry.clubA.trend > 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
                {rivalry.clubA.trend > 0 ? '+' : ''}{rivalry.clubA.trend}
              </span>
            </div>
          </div>
          
          {/* Club B */}
          <div className="text-center space-y-2">
            <img 
              src={clubBLogo} 
              alt={rivalry.clubB.name} 
              className="w-10 h-10 mx-auto object-contain"
            />
            <p className="text-xs font-medium truncate">{clubBInfo?.shortName || rivalry.clubB.name}</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold">{rivalry.clubB.sentiment}</span>
              <span>{categoryB.emoji}</span>
              <TrendIconB className={`w-3 h-3 ${rivalry.clubB.trend > 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`} />
              <span className={`text-[10px] ${rivalry.clubB.trend > 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
                {rivalry.clubB.trend > 0 ? '+' : ''}{rivalry.clubB.trend}
              </span>
            </div>
          </div>
        </div>
        
        {/* Next Match */}
        {rivalry.nextMatch && (
          <div className="pt-3 border-t border-border space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Next Match: {rivalry.nextMatch.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Location: {rivalry.nextMatch.location}</span>
            </div>
          </div>
        )}
        
        {/* Fan Activity */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Fan Activity Today
          </p>
          <div className="flex justify-between text-xs">
            <span>{clubAInfo?.shortName}: {(rivalry.clubA.mentions / 1000).toFixed(1)}K mentions</span>
            <span>{clubBInfo?.shortName}: {(rivalry.clubB.mentions / 1000).toFixed(1)}K mentions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RivalryWatch() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Swords className="w-5 h-5 text-destructive" />
            Rivalry Watch
          </h2>
          <p className="text-xs text-muted-foreground">Head-to-head sentiment battles</p>
        </div>
        <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
          {mockRivalries.length} Active Rivalries
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {mockRivalries.map((rivalry) => (
          <RivalryCard key={rivalry.name} rivalry={rivalry} />
        ))}
      </div>
    </div>
  );
}
