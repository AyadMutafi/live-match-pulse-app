import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📡</span>
          <h1 className="text-lg font-bold text-foreground">Fan Pulse</h1>
        </div>
        <Badge variant="outline" className="text-[10px] gap-1 border-muted-foreground/30 text-muted-foreground">
          <span>Powered by</span>
          <span className="font-bold">𝕏</span>
          <span>+</span>
          <span className="font-bold text-[hsl(var(--ai-green))]">Gemini AI</span>
        </Badge>
      </div>
    </header>
  );
}
