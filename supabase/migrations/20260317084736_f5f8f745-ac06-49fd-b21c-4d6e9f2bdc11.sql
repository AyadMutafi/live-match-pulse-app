
CREATE TABLE public.player_sentiment_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  league TEXT NOT NULL,
  position TEXT,
  sentiment_score NUMERIC NOT NULL DEFAULT 0,
  posts_analyzed INTEGER NOT NULL DEFAULT 0,
  avg_likes NUMERIC DEFAULT 0,
  avg_reposts NUMERIC DEFAULT 0,
  sample_posts JSONB DEFAULT '[]'::jsonb,
  source TEXT DEFAULT 'firecrawl',
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.player_sentiment_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on player_sentiment_scores"
  ON public.player_sentiment_scores
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_player_sentiment_player ON public.player_sentiment_scores (player_name);
CREATE INDEX idx_player_sentiment_league ON public.player_sentiment_scores (league);
CREATE INDEX idx_player_sentiment_analyzed ON public.player_sentiment_scores (analyzed_at DESC);
