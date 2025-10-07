import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Sparkles } from "lucide-react";
import { DisplaySettingsPanel } from "./DisplaySettingsPanel";

export function AppHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fan Pulse AI
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="relative"
          >
            <Settings2 className="w-5 h-5" />
            <span className="sr-only">Display Settings</span>
          </Button>
        </div>
      </header>

      <DisplaySettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
