
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePosts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['posts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useSocialAccounts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['social_accounts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useAnalyticsMetrics = (platform?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics_metrics', user?.id, platform],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('analytics_metrics')
        .select('*')
        .order('date', { ascending: false });
      
      if (platform && platform !== 'all') {
        query = query.eq('platform', platform);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (postData: {
      content: string;
      platform: string;
      scheduled_date?: string;
      status?: string;
      images?: string[];
      videos?: string[];
      files?: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...postData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUploadFile = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('post-media')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(fileName);
      
      return publicUrl;
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useConnectSocialAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (accountData: {
      platform: string;
      account_name: string;
      account_username: string;
      followers_count?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('social_accounts')
        .insert([{ ...accountData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_accounts'] });
    },
  });
};

export const useDisconnectSocialAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (accountId: string) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_accounts'] });
    },
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ accountId, isActive }: { accountId: string; isActive: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('update_social_account_status', {
        account_id: accountId,
        new_status: isActive,
        user_id_param: user.id
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_accounts'] });
    },
  });
};

export const useAccountHealth = (accountId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['account_health', accountId, user?.id],
    queryFn: async () => {
      if (!user || !accountId) return null;
      
      const { data, error } = await supabase.rpc('get_account_health', {
        account_id: accountId,
        user_id_param: user.id
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!accountId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};

export const useRefreshAccountToken = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (accountId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get the account details
      const { data: account, error: accountError } = await supabase
        .from('social_accounts')
        .select('platform, refresh_token')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .single();
      
      if (accountError) throw accountError;
      
      // Call the OAuth callback function to refresh the token
      const { data, error } = await supabase.functions.invoke('oauth-callback', {
        body: {
          action: 'refresh',
          accountId: accountId,
          platform: account.platform,
          refreshToken: account.refresh_token
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account_health'] });
    },
  });
};
