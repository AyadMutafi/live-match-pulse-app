import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FanProfile {
  id: string;
  user_id: string;
  fan_level: number;
  fan_points: number;
  team_loyalty_score: number;
  total_reactions: number;
  total_predictions: number;
  correct_predictions: number;
  matches_watched: number;
  engagement_streak: number;
  favorite_rivalry: any;
  earned_badges: string[];
  team_theme_enabled: boolean;
}

export function useFanProfile() {
  return useQuery({
    queryKey: ["fan-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("fan_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // Create profile if it doesn't exist
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from("fan_profiles")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        return newProfile as FanProfile;
      }

      return data as FanProfile;
    },
  });
}

export function useUpdateFanProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<FanProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("fan_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fan-profile"] });
      toast.success("Fan profile updated!");
    },
    onError: () => {
      toast.error("Failed to update fan profile");
    },
  });
}

export function useIncrementFanStat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      stat, 
      amount = 1 
    }: { 
      stat: 'total_reactions' | 'total_predictions' | 'matches_watched' | 'correct_predictions' | 'fan_points';
      amount?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current profile
      const { data: profile } = await supabase
        .from("fan_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const newValue = (profile[stat] || 0) + amount;
      const updates: any = { [stat]: newValue };

      // Calculate fan level based on points
      if (stat === 'fan_points') {
        const newLevel = Math.floor(newValue / 100) + 1;
        updates.fan_level = Math.min(newLevel, 100);
      }

      const { data, error } = await supabase
        .from("fan_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fan-profile"] });
    },
  });
}

export const FAN_BADGES = {
  ROOKIE: { name: "Rookie Fan", minLevel: 1, icon: "🌟", color: "text-gray-400" },
  SUPPORTER: { name: "Loyal Supporter", minLevel: 5, icon: "⚽", color: "text-blue-500" },
  DEDICATED: { name: "Dedicated Fan", minLevel: 10, icon: "🔥", color: "text-orange-500" },
  SUPERFAN: { name: "Super Fan", minLevel: 20, icon: "👑", color: "text-yellow-500" },
  LEGEND: { name: "Fan Legend", minLevel: 50, icon: "💎", color: "text-purple-500" },
  ULTIMATE: { name: "Ultimate Fan", minLevel: 100, icon: "🏆", color: "text-gradient" },
};

export function getFanBadge(level: number) {
  if (level >= 100) return FAN_BADGES.ULTIMATE;
  if (level >= 50) return FAN_BADGES.LEGEND;
  if (level >= 20) return FAN_BADGES.SUPERFAN;
  if (level >= 10) return FAN_BADGES.DEDICATED;
  if (level >= 5) return FAN_BADGES.SUPPORTER;
  return FAN_BADGES.ROOKIE;
}
