
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Calendar, Image, BarChart3, RefreshCw, Clock, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialAccounts, usePosts, useAnalyticsMetrics } from '@/hooks/useSupabaseData';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: socialAccounts = [] } = useSocialAccounts();
  const { data: posts = [] } = usePosts();
  const { data: analyticsData = [] } = useAnalyticsMetrics();
  const { toast } = useToast();

  // Calculate analytics summary
  const totalFollowers = socialAccounts.reduce((sum, account) => sum + (account.followers_count || 0), 0);
  const publishedPosts = posts.filter(post => post.status === 'published').length;
  const scheduledPosts = posts.filter(post => post.status === 'scheduled').length;
  const totalEngagement = posts.reduce((sum, post) => sum + (post.likes_count || 0) + (post.comments_count || 0) + (post.shares_count || 0), 0);

  // Get available platforms (not yet connected)
  const connectedPlatforms = socialAccounts.map(acc => acc.platform);
  const availablePlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'telegram']
    .filter(platform => !connectedPlatforms.includes(platform));

  const handleConnectAccount = () => {
    toast({
      title: "Connect Account",
      description: "Account connection feature will be available soon. For now, you can add accounts via the Profile page.",
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Here's what's happening with your accounts.</p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">Ready to publish</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEngagement}</div>
            <p className="text-xs text-muted-foreground">Likes, comments & shares</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Connected Accounts</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your social media accounts</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialAccounts.map((account) => (
              <div key={account.id} className="flex flex-col items-center p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  account.platform === 'twitter' ? 'bg-blue-500' :
                  account.platform === 'facebook' ? 'bg-blue-600' :
                  account.platform === 'instagram' ? 'bg-pink-500' :
                  account.platform === 'linkedin' ? 'bg-blue-600' :
                  account.platform === 'telegram' ? 'bg-sky-500' : 'bg-gray-400'
                }`}>
                  <SocialIcon platform={account.platform as SocialPlatform} size={24} className="text-white" />
                </div>
                <p className="font-medium text-sm text-center truncate w-full">{account.account_name}</p>
                <p className="text-xs text-gray-500 truncate w-full text-center">@{account.account_username}</p>
                <p className={`text-xs mt-1 ${account.is_connected ? 'text-green-600' : 'text-gray-500'}`}>
                  {account.is_connected ? 'Connected' : 'Disconnected'}
                </p>
                {account.followers_count && (
                  <p className="text-xs text-muted-foreground">{account.followers_count.toLocaleString()} followers</p>
                )}
              </div>
            ))}
            
            {/* Show available platforms to connect */}
            {availablePlatforms.slice(0, 3).map((platform) => (
              <div 
                key={platform} 
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleConnectAccount}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <SocialIcon platform={platform as SocialPlatform} size={24} className="text-gray-400" />
                </div>
                <p className="font-medium text-sm text-center">Connect {platform}</p>
                <p className="text-xs text-muted-foreground mt-1">Not connected</p>
              </div>
            ))}
            
            {/* Add more accounts option */}
            <div 
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleConnectAccount}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-sm text-center">Add Account</p>
              <p className="text-xs text-muted-foreground mt-1">Connect a new platform</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/analytics">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <Link to="/create-post">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Schedule Post</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Create and schedule content for your accounts</p>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <Link to="/content">
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Content Library</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload and manage your media assets</p>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <Link to="/analytics">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Analytics Report</span>
                  </div>
                  <p className="text-sm text-muted-foreground">View insights about your social performance</p>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <Link to="/profile">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Sync Accounts</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Refresh data from your connected platforms</p>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Latest updates from your accounts</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts
                .slice(0, 4)
                .map((post) => {
                  const getActivityMessage = () => {
                    if (post.status === 'published') return 'Post published';
                    if (post.status === 'scheduled') return 'Post scheduled';
                    return 'Post created';
                  };
                  
                  const getTimeAgo = (date: string) => {
                    const now = new Date();
                    const postDate = new Date(date);
                    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
                    
                    if (diffInHours < 1) return 'Just now';
                    if (diffInHours < 24) return `${diffInHours} hours ago`;
                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays < 7) return `${diffInDays} days ago`;
                    return postDate.toLocaleDateString();
                  };

                  return (
                    <div key={post.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        post.platform === 'twitter' ? 'bg-blue-500' :
                        post.platform === 'facebook' ? 'bg-blue-600' :
                        post.platform === 'instagram' ? 'bg-pink-500' :
                        post.platform === 'linkedin' ? 'bg-blue-600' : 'bg-gray-400'
                      }`}>
                        <SocialIcon platform={post.platform as SocialPlatform} size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {getActivityMessage()} on {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(post.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              {posts.length === 0 && (
                <div className="text-center py-6">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Posts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Posts</CardTitle>
            <p className="text-sm text-muted-foreground">Your scheduled content</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/schedule">View Calendar</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts
              .filter(post => post.status === 'scheduled' && post.scheduled_date)
              .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime())
              .slice(0, 3)
              .map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  post.platform === 'twitter' ? 'bg-blue-500' :
                  post.platform === 'facebook' ? 'bg-blue-600' :
                  post.platform === 'instagram' ? 'bg-pink-500' :
                  post.platform === 'linkedin' ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  <SocialIcon platform={post.platform as SocialPlatform} size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.scheduled_date!).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(post.scheduled_date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                  </svg>
                </Button>
              </div>
            ))}
            {posts.filter(post => post.status === 'scheduled').length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No upcoming posts scheduled</p>
                <Button asChild size="sm">
                  <Link to="/create-post">Schedule your first post</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
