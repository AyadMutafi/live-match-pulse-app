import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProValueScreen } from "@/components/ProValueScreen";
import { AnimatePresence } from "framer-motion";

export function AppHeader() {
  const [showProScreen, setShowProScreen] = useState(false);

  return (
    <>
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
              onClick={() => setShowProScreen(true)}
            >
              <Crown className="w-3 h-3" />
              PRO
            </Badge>
            <LanguageSelector variant="icon" />
            <Badge variant="outline" className="text-[10px] gap-1 border-muted-foreground/30 text-muted-foreground hidden sm:flex">
              <span>Powered by</span>
              <span className="font-bold text-[hsl(var(--ai-green))]">Gemini AI</span>
            </Badge>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showProScreen && (
          <ProValueScreen onClose={() => setShowProScreen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
