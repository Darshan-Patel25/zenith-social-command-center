-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  files TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_accounts table
CREATE TABLE public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_username TEXT,
  account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  followers_count INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics_metrics table
CREATE TABLE public.analytics_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  metric_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Users can view their own posts" 
  ON public.posts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts" 
  ON public.posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON public.posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for social_accounts
CREATE POLICY "Users can view their own social accounts" 
  ON public.social_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social accounts" 
  ON public.social_accounts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" 
  ON public.social_accounts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" 
  ON public.social_accounts FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for analytics_metrics
CREATE POLICY "Users can view their own analytics" 
  ON public.analytics_metrics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
  ON public.analytics_metrics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" 
  ON public.analytics_metrics FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics" 
  ON public.analytics_metrics FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_date ON public.posts(scheduled_date);
CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX idx_analytics_metrics_user_id ON public.analytics_metrics(user_id);
CREATE INDEX idx_analytics_metrics_metric_date ON public.analytics_metrics(metric_date);