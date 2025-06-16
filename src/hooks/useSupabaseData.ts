
import { useQuery } from '@tanstack/react-query';
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
