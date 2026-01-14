import { Badge } from "@/components/ui/badge";
import { Star, Swords } from "lucide-react";
import { getRivalryName, isFeaturedMatch } from "@/lib/constants";

interface FeaturedMatchBadgeProps {
  homeTeam: string;
  awayTeam: string;
}

export function FeaturedMatchBadge({ homeTeam, awayTeam }: FeaturedMatchBadgeProps) {
  const rivalryName = getRivalryName(homeTeam, awayTeam);
  const isFeatured = isFeaturedMatch(homeTeam, awayTeam);
  
  if (rivalryName) {
    return (
      <Badge 
        variant="default" 
        className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse"
      >
        <Swords className="w-3 h-3 mr-1" />
        {rivalryName.toUpperCase()}
      </Badge>
    );
  }
  
  if (isFeatured) {
    return (
      <Badge 
        variant="secondary" 
        className="text-[10px] bg-primary/20 text-primary border-primary/20"
      >
        <Star className="w-3 h-3 mr-1" />
        FEATURED
      </Badge>
    );
  }
  
  return null;
}
