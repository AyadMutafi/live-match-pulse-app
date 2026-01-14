import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, MessageSquare, Calendar } from "lucide-react";
import { TARGET_CLUBS, getSentimentCategory } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { Link } from "react-router-dom";

interface ClubSentimentData {
  name: string;
  shortName: string;
  sentiment: number;
  trend: number; // positive = up, negative = down
  mentions: number;
  nextMatch?: {
    opponent: string;
    date: string;
    competition: string;
  };
}

// Mock data - will be replaced with real API calls
const mockClubSentiments: ClubSentimentData[] = [
  { name: "FC Barcelona", shortName: "Barcelona", sentiment: 78, trend: 3, mentions: 52300, nextMatch: { opponent: "Real Madrid CF", date: "Oct 26, 21:00", competition: "La Liga" }},
  { name: "Real Madrid CF", shortName: "Real Madrid", sentiment: 72, trend: 2, mentions: 48700, nextMatch: { opponent: "FC Barcelona", date: "Oct 26, 21:00", competition: "La Liga" }},
  { name: "Atletico de Madrid", shortName: "Atlético Madrid", sentiment: 65, trend: -2, mentions: 21400, nextMatch: { opponent: "Sevilla FC", date: "Oct 27, 16:00", competition: "La Liga" }},
  { name: "Liverpool FC", shortName: "Liverpool", sentiment: 82, trend: 5, mentions: 61200, nextMatch: { opponent: "Arsenal FC", date: "Oct 27, 16:30", competition: "Premier League" }},
  { name: "Manchester City FC", shortName: "Man City", sentiment: 75, trend: 1, mentions: 45600, nextMatch: { opponent: "Southampton FC", date: "Oct 26, 15:00", competition: "Premier League" }},
  { name: "Manchester United FC", shortName: "Man United", sentiment: 45, trend: -8, mentions: 72100, nextMatch: { opponent: "West Ham United", date: "Oct 27, 14:00", competition: "Premier League" }},
  { name: "Arsenal FC", shortName: "Arsenal", sentiment: 71, trend: 4, mentions: 38900, nextMatch: { opponent: "Liverpool FC", date: "Oct 27, 16:30", competition: "Premier League" }},
];

function ClubCard({ club }: { club: ClubSentimentData }) {
  const logo = getTeamLogo(club.shortName);
  const category = getSentimentCategory(club.sentiment);
  const clubSlug = club.shortName.toLowerCase().replace(/\s+/g, '-');
  
  const TrendIcon = club.trend > 0 ? TrendingUp : club.trend < 0 ? TrendingDown : Minus;
  const trendColor = club.trend > 0 ? "text-[hsl(var(--success))]" : club.trend < 0 ? "text-[hsl(var(--destructive))]" : "text-muted-foreground";
  
  return (
    <Link to={`/club/${clubSlug}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Club Logo */}
            <img 
              src={logo} 
              alt={club.name} 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(club.shortName)}&background=random&size=128`;
              }}
            />
            
            <div className="flex-1 min-w-0">
              {/* Club Name & Sentiment */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm truncate">{club.shortName}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">{club.sentiment}</span>
                  <span className="text-lg">{category.emoji}</span>
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  <span className={`text-xs font-medium ${trendColor}`}>
                    {club.trend > 0 ? '+' : ''}{club.trend}
                  </span>
                </div>
              </div>
              
              {/* Sentiment Category */}
              <Badge 
                variant="secondary" 
                className="text-[10px] mb-2"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.name}
              </Badge>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {(club.mentions / 1000).toFixed(1)}K
                </span>
                {club.nextMatch && (
                  <span className="flex items-center gap-1 truncate">
                    <Calendar className="w-3 h-3" />
                    vs {club.nextMatch.opponent.split(' ').slice(0, 2).join(' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ClubSentimentOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Club Sentiment Overview</h2>
          <p className="text-xs text-muted-foreground">Real-time fan sentiment for monitored clubs</p>
        </div>
        <Badge variant="outline" className="text-xs">
          7 Clubs Monitored
        </Badge>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockClubSentiments.map((club) => (
          <ClubCard key={club.name} club={club} />
        ))}
      </div>
    </div>
  );
}
