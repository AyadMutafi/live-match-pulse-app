
-- Competitions table
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  country text,
  season text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Allow public write on competitions" ON public.competitions FOR ALL USING (true) WITH CHECK (true);

-- Data sources table for X accounts, hashtags, fan pages per team
CREATE TABLE public.data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('official', 'fanpage', 'hashtag', 'influencer')),
  platform text NOT NULL DEFAULT 'twitter',
  handle text,
  hashtag text,
  url text,
  display_name text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on data_sources" ON public.data_sources FOR SELECT USING (true);
CREATE POLICY "Allow public write on data_sources" ON public.data_sources FOR ALL USING (true) WITH CHECK (true);

-- Sentiment snapshots for time-series sentiment per match
CREATE TABLE public.sentiment_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  home_sentiment integer DEFAULT 50,
  home_emoji text DEFAULT '🙂',
  home_breakdown jsonb DEFAULT '{}',
  home_themes jsonb DEFAULT '[]',
  home_sample_tweets jsonb DEFAULT '[]',
  away_sentiment integer DEFAULT 50,
  away_emoji text DEFAULT '🙂',
  away_breakdown jsonb DEFAULT '{}',
  away_themes jsonb DEFAULT '[]',
  away_sample_tweets jsonb DEFAULT '[]',
  tweets_analyzed integer DEFAULT 0,
  ai_confidence integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.sentiment_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on sentiment_snapshots" ON public.sentiment_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public write on sentiment_snapshots" ON public.sentiment_snapshots FOR ALL USING (true) WITH CHECK (true);

-- Match monitoring config (admin activates matches for monitoring)
CREATE TABLE public.match_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  active boolean DEFAULT false,
  monitoring_start timestamptz,
  monitoring_end timestamptz,
  week_number integer,
  competition_slug text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.match_monitoring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on match_monitoring" ON public.match_monitoring FOR SELECT USING (true);
CREATE POLICY "Allow public write on match_monitoring" ON public.match_monitoring FOR ALL USING (true) WITH CHECK (true);
