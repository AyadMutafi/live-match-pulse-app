import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "auto";
export type DisplayDensity = "compact" | "comfortable" | "spacious";
export type AnimationSpeed = "slow" | "normal" | "fast" | "off";
export type ColorScheme = "default" | "vibrant" | "calm" | "neon" | "sunset";

interface DisplaySettings {
  theme: ThemeMode;
  density: DisplayDensity;
  animationSpeed: AnimationSpeed;
  colorScheme: ColorScheme;
  fontSize: number;
  showAnimations: boolean;
  blurBackground: boolean;
  compactCards: boolean;
  showPlayerPhotos: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface DisplaySettingsContextType {
  settings: DisplaySettings;
  updateSettings: (newSettings: Partial<DisplaySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: DisplaySettings = {
  theme: "dark",
  density: "comfortable",
  animationSpeed: "normal",
  colorScheme: "default",
  fontSize: 16,
  showAnimations: true,
  blurBackground: false,
  compactCards: false,
  showPlayerPhotos: true,
  autoRefresh: true,
  refreshInterval: 30,
};

const DisplaySettingsContext = createContext<DisplaySettingsContextType | undefined>(undefined);

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DisplaySettings>(() => {
    const saved = localStorage.getItem("displaySettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("displaySettings", JSON.stringify(settings));
    
    // Apply theme
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      // Auto mode
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Apply density
    root.setAttribute("data-density", settings.density);
    
    // Apply font size
    root.style.fontSize = `${settings.fontSize}px`;
    
    // Apply animation speed
    root.setAttribute("data-animation-speed", settings.animationSpeed);
    
    // Apply color scheme
    root.setAttribute("data-color-scheme", settings.colorScheme);
  }, [settings]);

  const updateSettings = (newSettings: Partial<DisplaySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <DisplaySettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export function useDisplaySettings() {
  const context = useContext(DisplaySettingsContext);
  if (context === undefined) {
    throw new Error("useDisplaySettings must be used within a DisplaySettingsProvider");
  }
  return context;
}
