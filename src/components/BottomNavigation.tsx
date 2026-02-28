import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "sentiments", emoji: "📊", label: "Sentiments" },
  { id: "ratings", emoji: "⭐", label: "Ratings" },
  { id: "totw", emoji: "🏆", label: "TOTW" },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/10 scale-105"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <span className={cn("text-xl transition-transform", isActive && "animate-pulse")}>{item.emoji}</span>
              <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
