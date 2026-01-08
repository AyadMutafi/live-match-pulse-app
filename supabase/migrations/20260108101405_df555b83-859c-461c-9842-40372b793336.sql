-- Remove the overly permissive policy that exposes all predictions publicly
DROP POLICY IF EXISTS "Users can view all predictions" ON match_predictions;

-- Note: The app is now a read-only monitoring dashboard with no user authentication,
-- so we'll keep predictions private (no public SELECT access).
-- If aggregate statistics are needed in the future, they should be provided via 
-- a secure edge function or an anonymous aggregate view.