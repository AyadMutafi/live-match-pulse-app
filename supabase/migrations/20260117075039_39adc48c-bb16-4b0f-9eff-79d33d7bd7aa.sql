-- Add SELECT policy for match_predictions table so users can view their own predictions
CREATE POLICY "Users can view their own predictions"
ON public.match_predictions
FOR SELECT
USING ((auth.uid())::text = (user_id)::text);