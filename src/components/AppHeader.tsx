import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, Moon, Sun, Home, Trophy, Globe, Info, Radio, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Matches", href: "/#matches", icon: Trophy },
  { name: "League Ratings", href: "/league-ratings", icon: Globe },
  { name: "Players", href: "/#players", icon: Users },
  { name: "About", href: "/about", icon: Info },
];

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

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

  const isActiveLink = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href.split("#")[0]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-primary" />
              <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full -z-10" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Fan Pulse AI
            </h1>
          </Link>
          
          {/* Monitoring Mode Badge */}
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">
            <Radio className="w-3 h-3 animate-pulse" />
            Monitoring
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.name}
            </Link>
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

                {/* Monitoring Badge */}
                <div className="p-4 border-b border-border">
                  <Badge variant="outline" className="w-full justify-center gap-1.5 text-xs py-2 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">
                    <Radio className="w-3 h-3 animate-pulse" />
                    Monitoring Mode - Read Only
                  </Badge>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <SheetClose asChild key={link.name}>
                          <Link
                            to={link.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActiveLink(link.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {link.name}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Sentiment data from 3 social platforms
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
