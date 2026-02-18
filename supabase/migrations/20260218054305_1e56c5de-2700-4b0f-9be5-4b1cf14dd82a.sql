
-- Create league_standings table for real standings data
CREATE TABLE public.league_standings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  league_code TEXT NOT NULL,
  league_name TEXT NOT NULL,
  season INTEGER NOT NULL,
  team_name TEXT NOT NULL,
  team_short_name TEXT,
  position INTEGER NOT NULL,
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  drawn INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  form TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(league_code, season, team_name)
);

-- Enable RLS
ALTER TABLE public.league_standings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on league_standings"
  ON public.league_standings
  FOR SELECT
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_league_standings_updated_at
  BEFORE UPDATE ON public.league_standings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
