import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📡</span>
          <h1 className="text-lg font-bold text-foreground">Fan Pulse</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <Crown className="w-3 h-3" />
            PRO
          </Badge>
          <Badge variant="outline" className="text-[10px] gap-1 border-muted-foreground/30 text-muted-foreground hidden sm:flex">
            <span>Powered by</span>
            <span className="font-bold text-[hsl(var(--ai-green))]">Gemini AI</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
