-- Fix overly permissive RLS policies

-- 1. match_reminders: Remove the dangerous "System can manage match reminders" ALL policy
-- This policy allows ANY user to modify ANY reminder, which is a security hole
DROP POLICY IF EXISTS "System can manage match reminders" ON match_reminders;

-- Add a proper policy for users to manage their own reminders
CREATE POLICY "Users can create their own match reminders"
ON public.match_reminders
FOR INSERT
WITH CHECK ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Users can update their own match reminders"
ON public.match_reminders
FOR UPDATE
USING ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Users can delete their own match reminders"
ON public.match_reminders
FOR DELETE
USING ((auth.uid())::text = (user_id)::text);

-- 2. shareable_moments: Remove the overly permissive INSERT policy
-- System inserts bypass RLS when using service role key, so this policy is not needed
DROP POLICY IF EXISTS "System can create shareable moments" ON shareable_moments;

-- 3. user_achievements: Remove the overly permissive INSERT policy  
-- System inserts bypass RLS when using service role key, so this policy is not needed
DROP POLICY IF EXISTS "System can insert achievements" ON user_achievements;

-- 4. fan_reactions: The public SELECT is intentional for social features
-- but we should document this is a deliberate design choice for the social feed
-- No changes needed - public reactions are part of the social experience