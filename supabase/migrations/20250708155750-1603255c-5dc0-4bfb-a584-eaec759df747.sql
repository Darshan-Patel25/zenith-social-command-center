-- Update OAuth app redirect URIs to point to the correct callback URL
UPDATE public.oauth_apps 
SET redirect_uri = 'https://id-preview--93ce1337-39b0-4354-998f-894b04609407.lovable.app/oauth/callback'
WHERE platform IN ('twitter', 'facebook', 'instagram', 'linkedin');

-- For local development, you might want to add localhost as well
-- UPDATE public.oauth_apps 
-- SET redirect_uri = 'http://localhost:5173/oauth/callback'
-- WHERE platform IN ('twitter', 'facebook', 'instagram', 'linkedin');