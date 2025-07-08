-- Add OAuth token fields to social_accounts table
ALTER TABLE public.social_accounts 
ADD COLUMN access_token TEXT,
ADD COLUMN refresh_token TEXT,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN oauth_user_id TEXT,
ADD COLUMN oauth_username TEXT,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create a table for OAuth app credentials (stored securely)
CREATE TABLE public.oauth_apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scopes TEXT[] DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform)
);

-- Enable RLS on oauth_apps table
ALTER TABLE public.oauth_apps ENABLE ROW LEVEL SECURITY;

-- Create policies for oauth_apps (admin only access)
CREATE POLICY "Admin can manage OAuth apps" 
ON public.oauth_apps 
FOR ALL 
USING (false) -- Initially restrict all access
WITH CHECK (false);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for oauth_apps updated_at
CREATE TRIGGER update_oauth_apps_updated_at
  BEFORE UPDATE ON public.oauth_apps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for social_accounts updated_at
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample OAuth app configurations (you'll need to update these with real credentials)
INSERT INTO public.oauth_apps (platform, client_id, client_secret, redirect_uri, scopes) VALUES
('twitter', 'your_twitter_client_id', 'your_twitter_client_secret', 'https://shywlntcmieyoprzhq.supabase.co/auth/v1/callback', ARRAY['read', 'write']),
('facebook', 'your_facebook_app_id', 'your_facebook_app_secret', 'https://shywlntcmieyoprzhq.supabase.co/auth/v1/callback', ARRAY['pages_manage_posts', 'pages_read_engagement']),
('instagram', 'your_instagram_client_id', 'your_instagram_client_secret', 'https://shywlntcmieyoprzhq.supabase.co/auth/v1/callback', ARRAY['user_profile', 'user_media']),
('linkedin', 'your_linkedin_client_id', 'your_linkedin_client_secret', 'https://shywlntcmieyoprzhq.supabase.co/auth/v1/callback', ARRAY['r_liteprofile', 'w_member_social']);

-- Create a function to initiate OAuth flow
CREATE OR REPLACE FUNCTION public.initiate_oauth_flow(
  platform_name TEXT,
  user_id_param UUID
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  app_config RECORD;
  auth_url TEXT;
  state_token TEXT;
BEGIN
  -- Get OAuth app configuration
  SELECT * INTO app_config FROM public.oauth_apps WHERE platform = platform_name;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'OAuth app not configured for platform: %', platform_name;
  END IF;
  
  -- Generate state token for security
  state_token := encode(gen_random_bytes(32), 'hex');
  
  -- Build authorization URL based on platform
  CASE platform_name
    WHEN 'twitter' THEN
      auth_url := 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' || app_config.client_id || '&redirect_uri=' || app_config.redirect_uri || '&scope=' || array_to_string(app_config.scopes, ' ') || '&state=' || state_token;
    WHEN 'facebook' THEN
      auth_url := 'https://www.facebook.com/v18.0/dialog/oauth?client_id=' || app_config.client_id || '&redirect_uri=' || app_config.redirect_uri || '&scope=' || array_to_string(app_config.scopes, ',') || '&state=' || state_token;
    WHEN 'instagram' THEN
      auth_url := 'https://api.instagram.com/oauth/authorize?client_id=' || app_config.client_id || '&redirect_uri=' || app_config.redirect_uri || '&scope=' || array_to_string(app_config.scopes, ',') || '&response_type=code&state=' || state_token;
    WHEN 'linkedin' THEN
      auth_url := 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' || app_config.client_id || '&redirect_uri=' || app_config.redirect_uri || '&scope=' || array_to_string(app_config.scopes, ' ') || '&state=' || state_token;
    ELSE
      RAISE EXCEPTION 'Unsupported platform: %', platform_name;
  END CASE;
  
  RETURN json_build_object(
    'auth_url', auth_url,
    'state', state_token,
    'platform', platform_name
  );
END;
$$;