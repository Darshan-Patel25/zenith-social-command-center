-- Add is_active column to social_accounts table for better account management
ALTER TABLE public.social_accounts 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to oauth_apps table to enable/disable OAuth apps
ALTER TABLE public.oauth_apps 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update the OAuth apps table with more realistic configuration
UPDATE public.oauth_apps 
SET 
  redirect_uri = 'https://shywlntcmieyiomprzhq.supabase.co/auth/v1/callback',
  is_active = true
WHERE platform IN ('twitter', 'facebook', 'instagram', 'linkedin');

-- Create function to update social account status
CREATE OR REPLACE FUNCTION public.update_social_account_status(
  account_id uuid,
  new_status boolean,
  user_id_param uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check if user owns this account
  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts 
    WHERE id = account_id AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Account not found or access denied';
  END IF;

  -- Update the account status
  UPDATE public.social_accounts 
  SET 
    is_active = new_status,
    updated_at = now()
  WHERE id = account_id AND user_id = user_id_param;

  RETURN json_build_object(
    'success', true,
    'message', 'Account status updated successfully'
  );
END;
$function$;

-- Create RLS policy for the new function
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Create function to get account analytics and health status
CREATE OR REPLACE FUNCTION public.get_account_health(
  account_id uuid,
  user_id_param uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  account_info RECORD;
  health_status TEXT := 'healthy';
  last_sync_hours INTEGER;
BEGIN
  -- Get account information
  SELECT * INTO account_info 
  FROM public.social_accounts 
  WHERE id = account_id AND user_id = user_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found or access denied';
  END IF;

  -- Calculate hours since last sync
  SELECT EXTRACT(EPOCH FROM (now() - account_info.last_synced_at)) / 3600 
  INTO last_sync_hours;

  -- Determine health status based on various factors
  IF account_info.access_token IS NULL THEN
    health_status := 'no_token';
  ELSIF NOT account_info.is_connected THEN
    health_status := 'disconnected';
  ELSIF last_sync_hours > 24 THEN
    health_status := 'sync_needed';
  ELSIF account_info.token_expires_at < now() THEN
    health_status := 'token_expired';
  END IF;

  RETURN json_build_object(
    'account_id', account_info.id,
    'platform', account_info.platform,
    'health_status', health_status,
    'is_active', account_info.is_active,
    'is_connected', account_info.is_connected,
    'last_synced_hours', last_sync_hours,
    'followers_count', account_info.followers_count,
    'token_expires_at', account_info.token_expires_at
  );
END;
$function$;