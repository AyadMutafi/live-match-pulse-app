import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, Moon, Sun, Home, Info, Radio, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { TARGET_CLUBS } from "@/lib/constants";

const navLinks = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
];

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
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
          
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">
            <Radio className="w-3 h-3 animate-pulse" />
            7 Clubs
          </Badge>
        </div>

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
          
          {/* Clubs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Clubs
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {TARGET_CLUBS.map((club) => (
                <DropdownMenuItem key={club.name} asChild>
                  <Link 
                    to={`/club/${club.shortName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: club.color }}
                    />
                    {club.shortName}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="relative w-9 h-9">
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDarkMode ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden w-9 h-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Fan Pulse AI</span>
                  </div>
                </div>

                <nav className="flex-1 p-4 space-y-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          to={link.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                            isActiveLink(link.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 px-4">Clubs</p>
                    {TARGET_CLUBS.map((club) => (
                      <SheetClose asChild key={club.name}>
                        <Link
                          to={`/club/${club.shortName.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-muted/50"
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: club.color }} />
                          {club.shortName}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
