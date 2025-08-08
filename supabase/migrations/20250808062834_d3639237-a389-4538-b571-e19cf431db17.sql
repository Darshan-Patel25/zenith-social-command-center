-- Update oauth_apps with correct redirect URIs for your deployed app
-- Replace 'YOUR_APP_DOMAIN' with your actual app domain

UPDATE oauth_apps 
SET redirect_uri = 'https://YOUR_APP_DOMAIN/oauth/callback'
WHERE platform IN ('twitter', 'facebook', 'instagram', 'linkedin');

-- Example: If your app is deployed at https://myapp.lovable.app
-- UPDATE oauth_apps 
-- SET redirect_uri = 'https://myapp.lovable.app/oauth/callback'
-- WHERE platform IN ('twitter', 'facebook', 'instagram', 'linkedin');