import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  followers_count?: number;
  profile_image_url?: string;
}

async function exchangeCodeForTokens(
  code: string,
  platform: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<OAuthTokenResponse> {
  let tokenUrl: string;
  let body: URLSearchParams;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  switch (platform) {
    case 'twitter':
      tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      break;
    case 'facebook':
      tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
      break;
    case 'instagram':
      tokenUrl = 'https://api.instagram.com/oauth/access_token';
      break;
    case 'linkedin':
      tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${errorText}`);
  }

  return await response.json();
}

async function getUserProfile(accessToken: string, platform: string): Promise<UserProfile> {
  let apiUrl: string;
  let headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
  };

  switch (platform) {
    case 'twitter':
      apiUrl = 'https://api.twitter.com/2/users/me?user.fields=public_metrics,profile_image_url';
      break;
    case 'facebook':
      apiUrl = 'https://graph.facebook.com/me?fields=id,name,username';
      break;
    case 'instagram':
      apiUrl = 'https://graph.instagram.com/me?fields=id,username,media_count,followers_count';
      break;
    case 'linkedin':
      apiUrl = 'https://api.linkedin.com/v2/people/~';
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch user profile: ${errorText}`);
  }

  const userData = await response.json();

  // Normalize user data across platforms
  let normalizedUser: UserProfile;
  
  switch (platform) {
    case 'twitter':
      normalizedUser = {
        id: userData.data.id,
        name: userData.data.name,
        username: userData.data.username,
        followers_count: userData.data.public_metrics?.followers_count,
        profile_image_url: userData.data.profile_image_url,
      };
      break;
    case 'facebook':
      normalizedUser = {
        id: userData.id,
        name: userData.name,
        username: userData.username || userData.id,
      };
      break;
    case 'instagram':
      normalizedUser = {
        id: userData.id,
        name: userData.username,
        username: userData.username,
        followers_count: userData.followers_count,
      };
      break;
    case 'linkedin':
      normalizedUser = {
        id: userData.id,
        name: `${userData.firstName?.localized?.en_US || ''} ${userData.lastName?.localized?.en_US || ''}`.trim(),
        username: userData.id,
      };
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return normalizedUser;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { code, state, platform, user_id } = await req.json();

    if (!code || !state || !platform || !user_id) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Get OAuth app configuration
    const { data: oauthApp, error: oauthError } = await supabase
      .from('oauth_apps')
      .select('*')
      .eq('platform', platform)
      .single();

    if (oauthError || !oauthApp) {
      return new Response('OAuth app not configured for this platform', { status: 400 });
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      code,
      platform,
      oauthApp.client_id,
      oauthApp.client_secret,
      oauthApp.redirect_uri
    );

    // Get user profile from the platform
    const userProfile = await getUserProfile(tokens.access_token, platform);

    // Calculate token expiration
    const tokenExpiresAt = tokens.expires_in 
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null;

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user_id)
      .eq('platform', platform)
      .eq('oauth_user_id', userProfile.id)
      .single();

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabase
        .from('social_accounts')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: tokenExpiresAt?.toISOString(),
          account_name: userProfile.name,
          account_username: userProfile.username,
          followers_count: userProfile.followers_count,
          is_connected: true,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', existingAccount.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new account
      const { error: insertError } = await supabase
        .from('social_accounts')
        .insert({
          user_id,
          platform,
          oauth_user_id: userProfile.id,
          oauth_username: userProfile.username,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: tokenExpiresAt?.toISOString(),
          account_name: userProfile.name,
          account_username: userProfile.username,
          followers_count: userProfile.followers_count,
          is_connected: true,
        });

      if (insertError) {
        throw insertError;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: userProfile 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});