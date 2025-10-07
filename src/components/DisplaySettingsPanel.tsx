import { useDisplaySettings } from "@/contexts/DisplaySettingsContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Zap, 
  Layout, 
  Type,
  Image,
  RefreshCw,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface DisplaySettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisplaySettingsPanel({ open, onOpenChange }: DisplaySettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useDisplaySettings();

  const colorSchemes = [
    { value: "default", label: "Default", gradient: "from-primary to-primary/60" },
    { value: "vibrant", label: "Vibrant", gradient: "from-pink-500 via-purple-500 to-blue-500" },
    { value: "calm", label: "Calm", gradient: "from-blue-400 to-teal-400" },
    { value: "neon", label: "Neon", gradient: "from-green-400 via-yellow-400 to-pink-500" },
    { value: "sunset", label: "Sunset", gradient: "from-orange-500 via-red-500 to-pink-500" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Display Settings
          </SheetTitle>
          <SheetDescription>
            Customize your viewing experience with creative display options
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="appearance" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            {/* Theme Mode */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Monitor className="w-4 h-4" />
                Theme Mode
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => updateSettings({ theme: "light" })}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => updateSettings({ theme: "dark" })}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={settings.theme === "auto" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto py-3"
                  onClick={() => updateSettings({ theme: "auto" })}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs">Auto</span>
                </Button>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Palette className="w-4 h-4" />
                Color Scheme
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {colorSchemes.map((scheme) => (
                  <Card
                    key={scheme.value}
                    className={`p-3 cursor-pointer transition-all hover:scale-105 ${
                      settings.colorScheme === scheme.value 
                        ? "ring-2 ring-primary" 
                        : "hover:ring-1 hover:ring-muted-foreground/20"
                    }`}
                    onClick={() => updateSettings({ colorScheme: scheme.value as any })}
                  >
                    <div className={`h-12 w-full rounded bg-gradient-to-r ${scheme.gradient} mb-2`} />
                    <p className="text-sm font-medium text-center">{scheme.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Type className="w-4 h-4" />
                Font Size: {settings.fontSize}px
              </Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSettings({ fontSize: value })}
                min={12}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* Background Blur */}
            <div className="flex items-center justify-between">
              <Label className="text-base">Blur Background Effects</Label>
              <Switch
                checked={settings.blurBackground}
                onCheckedChange={(checked) => updateSettings({ blurBackground: checked })}
              />
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-6 mt-6">
            {/* Display Density */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Layout className="w-4 h-4" />
                Display Density
              </Label>
              <Select
                value={settings.density}
                onValueChange={(value) => updateSettings({ density: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact - More info, less space</SelectItem>
                  <SelectItem value="comfortable">Comfortable - Balanced</SelectItem>
                  <SelectItem value="spacious">Spacious - More breathing room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Compact Cards */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Compact Cards</Label>
                <p className="text-sm text-muted-foreground">Show more content per screen</p>
              </div>
              <Switch
                checked={settings.compactCards}
                onCheckedChange={(checked) => updateSettings({ compactCards: checked })}
              />
            </div>

            {/* Show Player Photos */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2 text-base">
                  <Image className="w-4 h-4" />
                  Show Player Photos
                </Label>
                <p className="text-sm text-muted-foreground">Display player avatars and images</p>
              </div>
              <Switch
                checked={settings.showPlayerPhotos}
                onCheckedChange={(checked) => updateSettings({ showPlayerPhotos: checked })}
              />
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Animation Speed */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4" />
                Animation Speed
              </Label>
              <Select
                value={settings.animationSpeed}
                onValueChange={(value) => updateSettings({ animationSpeed: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off - No animations</SelectItem>
                  <SelectItem value="slow">Slow - Smooth & relaxed</SelectItem>
                  <SelectItem value="normal">Normal - Balanced</SelectItem>
                  <SelectItem value="fast">Fast - Snappy & quick</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show Animations */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">Toggle all transition effects</p>
              </div>
              <Switch
                checked={settings.showAnimations}
                onCheckedChange={(checked) => updateSettings({ showAnimations: checked })}
              />
            </div>

            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2 text-base">
                  <RefreshCw className="w-4 h-4" />
                  Auto Refresh Data
                </Label>
                <p className="text-sm text-muted-foreground">Automatically update live data</p>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSettings({ autoRefresh: checked })}
              />
            </div>

            {/* Refresh Interval */}
            {settings.autoRefresh && (
              <div className="space-y-3">
                <Label className="text-base">
                  Refresh Interval: {settings.refreshInterval}s
                </Label>
                <Slider
                  value={[settings.refreshInterval]}
                  onValueChange={([value]) => updateSettings({ refreshInterval: value })}
                  min={10}
                  max={120}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        <div className="mt-8 pt-6 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
