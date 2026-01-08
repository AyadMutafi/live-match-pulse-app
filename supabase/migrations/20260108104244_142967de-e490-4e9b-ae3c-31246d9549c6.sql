-- Fix the update_fan_profile_updated_at function to set search_path
CREATE OR REPLACE FUNCTION public.update_fan_profile_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;