-- Remove the overly permissive policy that exposes all achievements publicly
DROP POLICY IF EXISTS "Users can view all achievements" ON user_achievements;

-- Add a policy that only allows users to view their own achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
USING ((auth.uid())::text = (user_id)::text);