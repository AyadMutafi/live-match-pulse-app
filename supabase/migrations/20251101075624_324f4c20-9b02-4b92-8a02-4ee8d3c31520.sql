-- Add unique constraint on post_id for social_posts table
ALTER TABLE public.social_posts ADD CONSTRAINT social_posts_post_id_unique UNIQUE (post_id);