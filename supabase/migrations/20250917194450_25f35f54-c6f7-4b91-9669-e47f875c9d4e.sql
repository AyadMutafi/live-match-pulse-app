-- First, let's extend the profiles table to remove the single favorite_club_id constraint
-- and add notification preferences
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS favorite_club_id;

-- Create a separate table for multiple favorite teams
CREATE TABLE public.user_favorite_teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  team_id uuid NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, team_id)
);

-- Enable RLS on user_favorite_teams
ALTER TABLE public.user_favorite_teams ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorite_teams
CREATE POLICY "Users can view their own favorite teams" 
ON public.user_favorite_teams 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own favorite teams" 
ON public.user_favorite_teams 
FOR ALL
USING (auth.uid()::text = user_id::text);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  pre_match_reminders boolean DEFAULT true,
  match_result_notifications boolean DEFAULT true,
  prediction_reminders boolean DEFAULT true,
  team_news_updates boolean DEFAULT false,
  live_match_updates boolean DEFAULT true,
  reminder_time_minutes integer DEFAULT 60, -- minutes before match
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences" 
ON public.notification_preferences 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL
USING (auth.uid()::text = user_id::text);

-- Create table for match reminders
CREATE TABLE public.match_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  match_id uuid NOT NULL,
  reminder_sent boolean DEFAULT false,
  scheduled_time timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Enable RLS on match_reminders
ALTER TABLE public.match_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for match_reminders
CREATE POLICY "Users can view their own match reminders" 
ON public.match_reminders 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can manage match reminders" 
ON public.match_reminders 
FOR ALL
USING (true);

-- Create trigger for notification_preferences updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION public.create_user_notification_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$;

-- Update the existing handle_new_user function to also create notification preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
  
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;