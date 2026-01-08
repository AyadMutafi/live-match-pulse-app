import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Sparkles, HelpCircle, Menu, X, Moon, Sun, Home, Trophy, Globe, Info, Mail } from "lucide-react";
import { DisplaySettingsPanel } from "./DisplaySettingsPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Matches", href: "#matches", icon: Trophy },
  { name: "Leagues", href: "#leagues", icon: Globe },
  { name: "About", href: "#about", icon: Info },
  { name: "Contact", href: "#contact", icon: Mail },
];

export function AppHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem("fanpulse_onboarding_complete");
    window.location.reload();
  };

  const handleNavClick = (name: string) => {
    setActiveLink(name);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-primary" />
              <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full -z-10" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Fan Pulse AI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeLink === link.name
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="relative w-9 h-9"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300" />
                  ) : (
                    <Moon className="w-5 h-5 transition-transform duration-300" />
                  )}
                  <span className="sr-only">Toggle dark mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDarkMode ? "Light mode" : "Dark mode"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Help Button - Hidden on mobile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetOnboarding}
                  className="relative hidden sm:flex w-9 h-9"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="sr-only">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View tutorial again</p>
              </TooltipContent>
            </Tooltip>

            {/* Settings Button - Hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="relative hidden sm:flex w-9 h-9"
            >
              <Settings2 className="w-5 h-5" />
              <span className="sr-only">Display Settings</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden w-9 h-9"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <span className="font-bold text-lg">Fan Pulse AI</span>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <SheetClose asChild key={link.name}>
                            <a
                              href={link.href}
                              onClick={() => handleNavClick(link.name)}
                              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeLink === link.name
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              {link.name}
                            </a>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t border-border space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        setSettingsOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings2 className="w-5 h-5" />
                      Display Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        resetOnboarding();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <HelpCircle className="w-5 h-5" />
                      View Tutorial
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <DisplaySettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
