import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OAuthState {
  isLoading: boolean;
  error: string | null;
}

export const useOAuth = () => {
  const [state, setState] = useState<OAuthState>({
    isLoading: false,
    error: null,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const initiateOAuthFlow = async (platform: string) => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.rpc('initiate_oauth_flow', {
        platform_name: platform,
        user_id_param: user.id
      });

      if (error) throw error;

      const oauthData = data as { auth_url: string; state: string; platform: string };

      // Store the state token in localStorage for verification
      localStorage.setItem(`oauth_state_${platform}`, oauthData.state);
      
      // Redirect to OAuth provider
      window.location.href = oauthData.auth_url;
      
    } catch (error: any) {
      setState({ isLoading: false, error: error.message });
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOAuthCallback = async (code: string, state: string, platform: string) => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState({ isLoading: true, error: null });

    try {
      // Verify state token
      const storedState = localStorage.getItem(`oauth_state_${platform}`);
      if (storedState !== state) {
        throw new Error('Invalid state token');
      }

      // Exchange code for tokens via edge function
      const { data, error } = await supabase.functions.invoke('oauth-callback', {
        body: {
          code,
          state,
          platform,
          user_id: user.id
        }
      });

      if (error) throw error;

      // Clean up state token
      localStorage.removeItem(`oauth_state_${platform}`);

      setState({ isLoading: false, error: null });
      
      toast({
        title: "Account Connected",
        description: `Successfully connected your ${platform} account!`,
      });

      return data;
      
    } catch (error: any) {
      setState({ isLoading: false, error: error.message });
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const disconnectAccount = async (accountId: string) => {
    setState({ isLoading: true, error: null });

    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({
          access_token: null,
          refresh_token: null,
          token_expires_at: null,
          is_connected: false,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) throw error;

      setState({ isLoading: false, error: null });
      
      toast({
        title: "Account Disconnected",
        description: "Account has been disconnected successfully.",
      });
      
    } catch (error: any) {
      setState({ isLoading: false, error: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    ...state,
    initiateOAuthFlow,
    handleOAuthCallback,
    disconnectAccount,
  };
};