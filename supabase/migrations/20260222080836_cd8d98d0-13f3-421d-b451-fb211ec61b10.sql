
-- Create search history table for sentiment tracker
CREATE TABLE public.sentiment_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'all',
  post_limit INTEGER NOT NULL DEFAULT 25,
  total_posts INTEGER NOT NULL DEFAULT 0,
  positive_count INTEGER NOT NULL DEFAULT 0,
  negative_count INTEGER NOT NULL DEFAULT 0,
  neutral_count INTEGER NOT NULL DEFAULT 0,
  positive_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  negative_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  neutral_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sentiment_searches ENABLE ROW LEVEL SECURITY;

-- Public read/insert for this read-only dashboard (no auth)
CREATE POLICY "Allow public read on sentiment_searches"
  ON public.sentiment_searches FOR SELECT USING (true);

CREATE POLICY "Allow public insert on sentiment_searches"
  ON public.sentiment_searches FOR INSERT WITH CHECK (true);
