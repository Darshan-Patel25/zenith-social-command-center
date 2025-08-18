-- Fix critical security vulnerability in oauth_apps table
-- Drop existing policies that have security issues
DROP POLICY IF EXISTS "Admin can manage OAuth apps" ON public.oauth_apps;
DROP POLICY IF EXISTS "Service role can manage OAuth apps" ON public.oauth_apps;

-- Create secure policies that explicitly deny public access
-- Only allow service role access for OAuth operations
CREATE POLICY "Service role full access"
  ON public.oauth_apps
  FOR ALL
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Explicitly deny access to authenticated users
CREATE POLICY "Deny authenticated access"
  ON public.oauth_apps
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Explicitly deny access to anonymous users
CREATE POLICY "Deny anonymous access"
  ON public.oauth_apps
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Create a secure function for getting OAuth config (used by edge functions)
CREATE OR REPLACE FUNCTION public.get_oauth_config(platform_name text)
RETURNS TABLE(
  client_id text,
  client_secret text,
  redirect_uri text,
  scopes text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oa.client_id,
    oa.client_secret,
    oa.redirect_uri,
    oa.scopes
  FROM public.oauth_apps oa
  WHERE oa.platform = platform_name 
    AND oa.is_active = true;
END;
$$;

-- Grant execute permission only to service role
REVOKE ALL ON FUNCTION public.get_oauth_config(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_oauth_config(text) TO service_role;