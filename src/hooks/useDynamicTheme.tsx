import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DynamicThemeParams {
  matchId?: string;
  teamId?: string;
  enabled?: boolean;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  intensity: 'low' | 'medium' | 'high';
}

export function useDynamicTheme({ matchId, teamId, enabled = true }: DynamicThemeParams) {
  const { data: themeData } = useQuery({
    queryKey: ['dynamic-theme', matchId, teamId],
    queryFn: async (): Promise<ThemeColors> => {
      let intensity: 'low' | 'medium' | 'high' = 'medium';
      let primaryHue = 264; // Default purple
      let secondaryHue = 250;
      let accentHue = 352;

      // Get match intensity from recent activity
      if (matchId) {
        const { data: recentReactions } = await supabase
          .from('fan_reactions')
          .select('intensity')
          .eq('match_id', matchId)
          .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString());

        const avgIntensity = recentReactions?.reduce((sum, r) => sum + r.intensity, 0) / (recentReactions?.length || 1);
        
        if (avgIntensity > 75) {
          intensity = 'high';
          accentHue = 0; // Red for high intensity
        } else if (avgIntensity > 50) {
          intensity = 'medium';
          accentHue = 38; // Orange for medium
        } else {
          intensity = 'low';
          accentHue = 200; // Blue for calm
        }
      }

      // Get team colors
      if (teamId) {
        const { data: team } = await supabase
          .from('teams')
          .select('colors')
          .eq('id', teamId)
          .single();

        if (team?.colors) {
          const colors = team.colors as any;
          primaryHue = colors.primary || primaryHue;
          secondaryHue = colors.secondary || secondaryHue;
        }
      }

      return {
        primary: `${primaryHue} 67% 49%`,
        secondary: `${secondaryHue} 50% 40%`,
        accent: `${accentHue} 91% 59%`,
        intensity
      };
    },
    enabled: enabled && (!!matchId || !!teamId),
    refetchInterval: 60000, // Update every minute
  });

  useEffect(() => {
    if (!themeData || !enabled) return;

    const root = document.documentElement;
    
    // Apply dynamic theme colors
    root.style.setProperty('--primary', themeData.primary);
    root.style.setProperty('--secondary', themeData.secondary);
    root.style.setProperty('--accent', themeData.accent);

    // Apply intensity-based effects
    switch (themeData.intensity) {
      case 'high':
        root.setAttribute('data-intensity', 'high');
        root.style.setProperty('--animation-speed', '0.15s');
        break;
      case 'medium':
        root.setAttribute('data-intensity', 'medium');
        root.style.setProperty('--animation-speed', '0.25s');
        break;
      case 'low':
        root.setAttribute('data-intensity', 'low');
        root.style.setProperty('--animation-speed', '0.35s');
        break;
    }

    return () => {
      // Reset to defaults when unmounting
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.removeAttribute('data-intensity');
    };
  }, [themeData, enabled]);

  return { themeData, isActive: enabled && !!themeData };
}
