import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeamLogo } from "@/lib/teamLogos";

interface Player {
  position: string;
  name: string;
  team: string;
  rating: number;
  reason: string;
}

interface FieldFormationProps {
  players: Player[];
  formation?: string;
}

const getPlayerEmoji = (rating: number) => {
  if (rating >= 9.5) return "🔥"; // World-class
  if (rating >= 9.0) return "⭐"; // Excellent
  if (rating >= 8.5) return "💎"; // Very good
  if (rating >= 8.0) return "✨"; // Good
  return "⚡"; // Solid
};

const getPositionCoordinates = (position: string) => {
  const positions: Record<string, { x: string; y: string }> = {
    // Goalkeeper
    GK: { x: "50%", y: "90%" },
    // Defenders (4)
    LB: { x: "15%", y: "70%" },
    CB: { x: "37%", y: "75%" },
    RB: { x: "85%", y: "70%" },
    // Midfielders (3)
    LM: { x: "20%", y: "45%" },
    CM: { x: "50%", y: "50%" },
    RM: { x: "80%", y: "45%" },
    // Forwards (3)
    LW: { x: "20%", y: "20%" },
    ST: { x: "50%", y: "15%" },
    RW: { x: "80%", y: "20%" },
  };
  return positions[position] || { x: "50%", y: "50%" };
};

export function FieldFormation({ players, formation = "4-3-3" }: FieldFormationProps) {
  // Adjust positions for 4-3-3 formation
  const sortedPlayers = [...players].sort((a, b) => {
    const order = ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "RM", "LW", "ST", "RW"];
    const aIndex = order.indexOf(a.position);
    const bIndex = order.indexOf(b.position);
    return aIndex - bIndex;
  });

  // Adjust CB positions
  const adjustedPlayers = sortedPlayers.map((player, index) => {
    if (player.position === "CB") {
      const cbCount = sortedPlayers.filter((p, i) => i <= index && p.position === "CB").length;
      return {
        ...player,
        adjustedPosition: cbCount === 1 ? "CB-L" : "CB-R",
      };
    }
    return { ...player, adjustedPosition: player.position };
  });

  const getAdjustedCoordinates = (adjustedPosition: string) => {
    if (adjustedPosition === "CB-L") return { x: "37%", y: "75%" };
    if (adjustedPosition === "CB-R") return { x: "63%", y: "75%" };
    return getPositionCoordinates(adjustedPosition);
  };

  return (
    <Card className="relative w-full bg-gradient-to-b from-emerald-600 to-emerald-700 overflow-hidden">
      {/* Football pitch */}
      <div className="relative w-full aspect-[3/4] min-h-[600px]">
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 130">
          {/* Outer boundary */}
          <rect x="2" y="2" width="96" height="126" fill="none" stroke="white" strokeWidth="0.5" />
          
          {/* Center line */}
          <line x1="2" y1="65" x2="98" y2="65" stroke="white" strokeWidth="0.5" />
          
          {/* Center circle */}
          <circle cx="50" cy="65" r="10" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="65" r="0.5" fill="white" />
          
          {/* Penalty areas */}
          <rect x="20" y="2" width="60" height="18" fill="none" stroke="white" strokeWidth="0.5" />
          <rect x="20" y="110" width="60" height="18" fill="none" stroke="white" strokeWidth="0.5" />
          
          {/* Goal areas */}
          <rect x="35" y="2" width="30" height="8" fill="none" stroke="white" strokeWidth="0.5" />
          <rect x="35" y="120" width="30" height="8" fill="none" stroke="white" strokeWidth="0.5" />
          
          {/* Penalty spots */}
          <circle cx="50" cy="12" r="0.5" fill="white" />
          <circle cx="50" cy="118" r="0.5" fill="white" />
          
          {/* Corner arcs */}
          <path d="M 2 2 Q 7 2 7 7" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M 98 2 Q 93 2 93 7" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M 2 128 Q 7 128 7 123" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M 98 128 Q 93 128 93 123" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Grass pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[10%] w-full"
              style={{
                backgroundColor: i % 2 === 0 ? "rgba(0,0,0,0.1)" : "transparent",
              }}
            />
          ))}
        </div>

        {/* Players */}
        {adjustedPlayers.map((player, index) => {
          const coords = getAdjustedCoordinates(player.adjustedPosition);
          const emoji = getPlayerEmoji(player.rating);
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer animate-fade-in"
              style={{
                left: coords.x,
                top: coords.y,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Player card */}
              <div className="relative flex flex-col items-center">
                {/* Player circle */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white/95 border-4 border-primary shadow-lg flex flex-col items-center justify-center transform transition-transform group-hover:scale-110">
                    <span className="text-2xl mb-0.5">{emoji}</span>
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 bg-accent text-accent-foreground"
                    >
                      {player.rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>

                {/* Player name */}
                <div className="mt-2 bg-white/95 px-2 py-1 rounded-md shadow-md text-center min-w-[100px]">
                  <div className="text-xs font-bold text-foreground whitespace-nowrap">
                    {player.name}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <img 
                      src={getTeamLogo(player.team)} 
                      alt={player.team}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.team)}&background=random&size=32`;
                      }}
                    />
                  </div>
                </div>

                {/* Hover tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card p-3 rounded-lg shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48">
                  <div className="text-xs">
                    <div className="font-semibold mb-1 text-foreground">{player.position}</div>
                    <div className="text-muted-foreground">{player.reason}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Formation badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-foreground text-sm font-bold px-3 py-1">
            {formation}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
