export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      fan_profiles: {
        Row: {
          correct_predictions: number | null
          created_at: string | null
          earned_badges: Json | null
          engagement_streak: number | null
          fan_level: number | null
          fan_points: number | null
          favorite_rivalry: Json | null
          id: string
          matches_watched: number | null
          team_loyalty_score: number | null
          team_theme_enabled: boolean | null
          total_predictions: number | null
          total_reactions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_predictions?: number | null
          created_at?: string | null
          earned_badges?: Json | null
          engagement_streak?: number | null
          fan_level?: number | null
          fan_points?: number | null
          favorite_rivalry?: Json | null
          id?: string
          matches_watched?: number | null
          team_loyalty_score?: number | null
          team_theme_enabled?: boolean | null
          total_predictions?: number | null
          total_reactions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_predictions?: number | null
          created_at?: string | null
          earned_badges?: Json | null
          engagement_streak?: number | null
          fan_level?: number | null
          fan_points?: number | null
          favorite_rivalry?: Json | null
          id?: string
          matches_watched?: number | null
          team_loyalty_score?: number | null
          team_theme_enabled?: boolean | null
          total_predictions?: number | null
          total_reactions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fan_reactions: {
        Row: {
          content: string | null
          created_at: string
          emoji: string
          id: string
          intensity: number | null
          match_id: string | null
          player_id: string | null
          reaction_type: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          emoji: string
          id?: string
          intensity?: number | null
          match_id?: string | null
          player_id?: string | null
          reaction_type: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          emoji?: string
          id?: string
          intensity?: number | null
          match_id?: string | null
          player_id?: string | null
          reaction_type?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      league_standings: {
        Row: {
          created_at: string
          drawn: number
          form: string | null
          goal_difference: number
          goals_against: number
          goals_for: number
          id: string
          league_code: string
          league_name: string
          lost: number
          played: number
          points: number
          position: number
          season: number
          team_name: string
          team_short_name: string | null
          updated_at: string
          won: number
        }
        Insert: {
          created_at?: string
          drawn?: number
          form?: string | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          league_code: string
          league_name: string
          lost?: number
          played?: number
          points?: number
          position: number
          season: number
          team_name: string
          team_short_name?: string | null
          updated_at?: string
          won?: number
        }
        Update: {
          created_at?: string
          drawn?: number
          form?: string | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          league_code?: string
          league_name?: string
          lost?: number
          played?: number
          points?: number
          position?: number
          season?: number
          team_name?: string
          team_short_name?: string | null
          updated_at?: string
          won?: number
        }
        Relationships: []
      }
      match_emotions: {
        Row: {
          avg_sentiment: number | null
          created_at: string
          emotion_distribution: Json
          id: string
          match_id: string
          peak_moments: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          team_id: string
          total_posts: number
          updated_at: string
        }
        Insert: {
          avg_sentiment?: number | null
          created_at?: string
          emotion_distribution: Json
          id?: string
          match_id: string
          peak_moments?: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          team_id: string
          total_posts?: number
          updated_at?: string
        }
        Update: {
          avg_sentiment?: number | null
          created_at?: string
          emotion_distribution?: Json
          id?: string
          match_id?: string
          peak_moments?: Json | null
          platform?: Database["public"]["Enums"]["social_platform"]
          team_id?: string
          total_posts?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_emotions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_emotions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_predictions: {
        Row: {
          actual_result: string | null
          created_at: string
          id: string
          match_id: string
          points_earned: number | null
          predicted_away_score: number | null
          predicted_dominant_emotion: string | null
          predicted_home_score: number | null
          predicted_winner: string | null
          user_id: string
        }
        Insert: {
          actual_result?: string | null
          created_at?: string
          id?: string
          match_id: string
          points_earned?: number | null
          predicted_away_score?: number | null
          predicted_dominant_emotion?: string | null
          predicted_home_score?: number | null
          predicted_winner?: string | null
          user_id: string
        }
        Update: {
          actual_result?: string | null
          created_at?: string
          id?: string
          match_id?: string
          points_earned?: number | null
          predicted_away_score?: number | null
          predicted_dominant_emotion?: string | null
          predicted_home_score?: number | null
          predicted_winner?: string | null
          user_id?: string
        }
        Relationships: []
      }
      match_reminders: {
        Row: {
          created_at: string
          id: string
          match_id: string
          reminder_sent: boolean | null
          scheduled_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          reminder_sent?: boolean | null
          scheduled_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          reminder_sent?: boolean | null
          scheduled_time?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          api_match_id: string | null
          away_score: number | null
          away_team_id: string
          competition: string
          created_at: string
          home_score: number | null
          home_team_id: string
          id: string
          match_date: string
          status: string
          updated_at: string
        }
        Insert: {
          api_match_id?: string | null
          away_score?: number | null
          away_team_id: string
          competition: string
          created_at?: string
          home_score?: number | null
          home_team_id: string
          id?: string
          match_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          api_match_id?: string | null
          away_score?: number | null
          away_team_id?: string
          competition?: string
          created_at?: string
          home_score?: number | null
          home_team_id?: string
          id?: string
          match_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          live_match_updates: boolean | null
          match_result_notifications: boolean | null
          pre_match_reminders: boolean | null
          prediction_reminders: boolean | null
          reminder_time_minutes: number | null
          team_news_updates: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          live_match_updates?: boolean | null
          match_result_notifications?: boolean | null
          pre_match_reminders?: boolean | null
          prediction_reminders?: boolean | null
          reminder_time_minutes?: number | null
          team_news_updates?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          live_match_updates?: boolean | null
          match_result_notifications?: boolean | null
          pre_match_reminders?: boolean | null
          prediction_reminders?: boolean | null
          reminder_time_minutes?: number | null
          team_news_updates?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          position: string | null
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          position?: string | null
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          position?: string | null
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          correct_predictions: number | null
          created_at: string
          display_name: string | null
          emotion_score: number | null
          id: string
          prediction_streak: number | null
          total_predictions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_predictions?: number | null
          created_at?: string
          display_name?: string | null
          emotion_score?: number | null
          id?: string
          prediction_streak?: number | null
          total_predictions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_predictions?: number | null
          created_at?: string
          display_name?: string | null
          emotion_score?: number | null
          id?: string
          prediction_streak?: number | null
          total_predictions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sentiment_searches: {
        Row: {
          created_at: string
          id: string
          keyword: string
          language: string
          negative_count: number
          negative_pct: number
          neutral_count: number
          neutral_pct: number
          positive_count: number
          positive_pct: number
          post_limit: number
          summary: string | null
          total_posts: number
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
          language?: string
          negative_count?: number
          negative_pct?: number
          neutral_count?: number
          neutral_pct?: number
          positive_count?: number
          positive_pct?: number
          post_limit?: number
          summary?: string | null
          total_posts?: number
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
          language?: string
          negative_count?: number
          negative_pct?: number
          neutral_count?: number
          neutral_pct?: number
          positive_count?: number
          positive_pct?: number
          post_limit?: number
          summary?: string | null
          total_posts?: number
        }
        Relationships: []
      }
      shareable_moments: {
        Row: {
          created_at: string
          description: string | null
          emotion_data: Json | null
          id: string
          image_url: string | null
          match_id: string | null
          moment_type: string
          player_id: string | null
          share_count: number | null
          team_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emotion_data?: Json | null
          id?: string
          image_url?: string | null
          match_id?: string | null
          moment_type: string
          player_id?: string | null
          share_count?: number | null
          team_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emotion_data?: Json | null
          id?: string
          image_url?: string | null
          match_id?: string | null
          moment_type?: string
          player_id?: string | null
          share_count?: number | null
          team_id?: string | null
          title?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          author_handle: string | null
          content: string
          created_at: string
          emotions: Json | null
          engagement_metrics: Json | null
          id: string
          match_id: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          player_id: string | null
          post_id: string
          posted_at: string
          processed_at: string | null
          sentiment_score: number | null
          team_id: string | null
        }
        Insert: {
          author_handle?: string | null
          content: string
          created_at?: string
          emotions?: Json | null
          engagement_metrics?: Json | null
          id?: string
          match_id?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          player_id?: string | null
          post_id: string
          posted_at: string
          processed_at?: string | null
          sentiment_score?: number | null
          team_id?: string | null
        }
        Update: {
          author_handle?: string | null
          content?: string
          created_at?: string
          emotions?: Json | null
          engagement_metrics?: Json | null
          id?: string
          match_id?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          player_id?: string | null
          post_id?: string
          posted_at?: string
          processed_at?: string | null
          sentiment_score?: number | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_rivalries: {
        Row: {
          created_at: string | null
          draws: number | null
          favorite_team_id: string
          id: string
          intensity_score: number | null
          losses: number | null
          rival_team_id: string
          user_id: string
          wins: number | null
        }
        Insert: {
          created_at?: string | null
          draws?: number | null
          favorite_team_id: string
          id?: string
          intensity_score?: number | null
          losses?: number | null
          rival_team_id: string
          user_id: string
          wins?: number | null
        }
        Update: {
          created_at?: string | null
          draws?: number | null
          favorite_team_id?: string
          id?: string
          intensity_score?: number | null
          losses?: number | null
          rival_team_id?: string
          user_id?: string
          wins?: number | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          colors: Json | null
          country: string
          created_at: string
          id: string
          league: string
          name: string
          social_handles: Json | null
          updated_at: string
        }
        Insert: {
          colors?: Json | null
          country: string
          created_at?: string
          id?: string
          league: string
          name: string
          social_handles?: Json | null
          updated_at?: string
        }
        Update: {
          colors?: Json | null
          country?: string
          created_at?: string
          id?: string
          league?: string
          name?: string
          social_handles?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_teams: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          team_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      social_platform: "twitter" | "instagram" | "facebook"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      social_platform: ["twitter", "instagram", "facebook"],
    },
  },
} as const
