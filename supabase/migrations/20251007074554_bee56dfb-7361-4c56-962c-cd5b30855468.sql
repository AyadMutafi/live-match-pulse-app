-- Create fan_profiles table to track detailed fan engagement
CREATE TABLE IF NOT EXISTS public.fan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  fan_level INTEGER DEFAULT 1,
  fan_points INTEGER DEFAULT 0,
  team_loyalty_score INTEGER DEFAULT 0,
  total_reactions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  matches_watched INTEGER DEFAULT 0,
  engagement_streak INTEGER DEFAULT 0,
  favorite_rivalry JSONB DEFAULT '{}',
  earned_badges JSONB DEFAULT '[]',
  team_theme_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.fan_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own fan profile
CREATE POLICY "Users can view their own fan profile"
  ON public.fan_profiles
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Users can update their own fan profile
CREATE POLICY "Users can update their own fan profile"
  ON public.fan_profiles
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Users can insert their own fan profile
CREATE POLICY "Users can insert their own fan profile"
  ON public.fan_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create team_rivalries table
CREATE TABLE IF NOT EXISTS public.team_rivalries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  favorite_team_id UUID NOT NULL,
  rival_team_id UUID NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  intensity_score INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, favorite_team_id, rival_team_id)
);

-- Enable RLS
ALTER TABLE public.team_rivalries ENABLE ROW LEVEL SECURITY;

-- Users can manage their rivalries
CREATE POLICY "Users can manage their rivalries"
  ON public.team_rivalries
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Create trigger for updating fan profile
CREATE OR REPLACE FUNCTION public.update_fan_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fan_profiles_updated_at
  BEFORE UPDATE ON public.fan_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fan_profile_updated_at();