
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Calendar, Image, BarChart3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialAccounts, usePosts } from '@/hooks/useSupabaseData';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: socialAccounts = [] } = useSocialAccounts();
  const { data: posts = [] } = usePosts();

  // Mock data for connected accounts (in a real app, this would come from your database)
  const mockAccounts = [
    { platform: 'twitter' as SocialPlatform, name: '@yourbrand', connected: true },
    { platform: 'facebook' as SocialPlatform, name: 'Your Brand', connected: true },
    { platform: 'instagram' as SocialPlatform, name: '@yourbrand', connected: true },
    { platform: 'linkedin' as SocialPlatform, name: 'Your Brand', connected: false },
  ];

  // Recent activity mock data (in a real app, this would come from your database)
  const recentActivity = [
    { id: 1, action: 'Post published on Twitter', time: '30 mins ago', platform: 'twitter' as SocialPlatform },
    { id: 2, action: 'Post scheduled for Instagram', time: '2 hours ago', platform: 'instagram' as SocialPlatform },
    { id: 3, action: 'LinkedIn account connected', time: '5 hours ago', platform: 'linkedin' as SocialPlatform },
    { id: 4, action: 'New comments on Facebook post', time: 'Jun 10', platform: 'facebook' as SocialPlatform },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your accounts.</p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
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
            {mockAccounts.map((account, index) => (
              <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  account.platform === 'twitter' ? 'bg-blue-500' :
                  account.platform === 'facebook' ? 'bg-blue-600' :
                  account.platform === 'instagram' ? 'bg-pink-500' :
                  account.platform === 'linkedin' ? 'bg-gray-400' : 'bg-gray-400'
                }`}>
                  <SocialIcon platform={account.platform} size={24} className="text-white" />
                </div>
                <p className="font-medium text-sm text-center">{account.name}</p>
                <p className={`text-xs mt-1 ${account.connected ? 'text-green-600' : 'text-gray-500'}`}>
                  {account.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            ))}
            <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
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
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Sync Accounts</span>
                </div>
                <p className="text-sm text-muted-foreground">Refresh data from your connected platforms</p>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest actions from your accounts</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.platform === 'twitter' ? 'bg-blue-100' :
                    activity.platform === 'facebook' ? 'bg-blue-100' :
                    activity.platform === 'instagram' ? 'bg-pink-100' :
                    activity.platform === 'linkedin' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <SocialIcon platform={activity.platform} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
