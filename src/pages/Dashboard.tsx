import React, { useState } from 'react';
import {
  Users,
  FileText,
  Share,
  Clock,
  Bell,
  Plus,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Calendar,
  ImageIcon,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import SocialIcon from '@/components/common/SocialIcon';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';
import { SocialPlatform } from '@/types';

const connectedAccounts = [
  {
    platform: 'Twitter',
    icon: Twitter,
    username: '@yourbrand',
    status: 'Connected',
    color: 'bg-blue-500',
  },
  {
    platform: 'Facebook',
    icon: Facebook,
    username: 'Your Brand',
    status: 'Connected',
    color: 'bg-blue-600',
  },
  {
    platform: 'Instagram',
    icon: Instagram,
    username: '@yourbrand',
    status: 'Connected',
    color: 'bg-pink-500',
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    username: 'Your Brand',
    status: 'Not connected',
    color: 'bg-blue-700',
  },
];

const quickActions = [
  {
    title: 'Schedule Post',
    description: 'Create and schedule content for your accounts',
    icon: Calendar,
    href: '/content/create',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Content Library',
    description: 'Upload and manage your media assets',
    icon: ImageIcon,
    href: '/content',
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Analytics Report',
    description: 'View insights about your social performance',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Sync Accounts',
    description: 'Refresh data from your connected platforms',
    icon: RefreshCw,
    href: '#',
    color: 'bg-orange-50 text-orange-600',
  },
];

const Dashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const navigate = useNavigate();

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: null },
    { id: 'instagram', label: 'Instagram', icon: 'instagram' as SocialPlatform },
    { id: 'twitter', label: 'Twitter', icon: 'twitter' as SocialPlatform },
    { id: 'facebook', label: 'Facebook', icon: 'facebook' as SocialPlatform },
    { id: 'telegram', label: 'Telegram', icon: 'telegram' as SocialPlatform },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen pl-6 pr-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your social media performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/create-post')}
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? 'default' : 'outline'}
            className={`gap-2 ${
              selectedPlatform === platform.id
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            {platform.icon && <SocialIcon platform={platform.icon} size={16} />}
            <span>{platform.label}</span>
          </Button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Followers', value: '24,500', Icon: Users, color: 'bg-blue-100', text: 'text-blue-600' },
          { label: 'Posts', value: '342', Icon: FileText, color: 'bg-purple-100', text: 'text-purple-600' },
          { label: 'Engagement', value: '3.7%', Icon: Share, color: 'bg-green-100', text: 'text-green-600' },
          { label: 'Reach', value: '86.0K', Icon: Clock, color: 'bg-orange-100', text: 'text-orange-600' },
        ].map(({ label, value, Icon, color, text }) => (
          <Card key={label} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${text}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected Accounts */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold text-foreground">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground">Manage your social media accounts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {connectedAccounts.map((account) => (
              <Card key={account.platform} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3', account.color)}>
                    <account.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-foreground">{account.username}</h3>
                  <p className={cn('text-sm mt-1', account.status === 'Connected' ? 'text-green-600' : 'text-muted-foreground')}>{account.status}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="hover:shadow-md transition-shadow border-dashed">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="font-medium text-foreground">Add Account</h3>
                <p className="text-sm text-muted-foreground mt-1">Connect a new platform</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            <Button variant="ghost" className="text-sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer group">
                <Link to={action.href}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={cn("p-3 rounded-lg", action.color)}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Posts */}
      <UpcomingPosts />
    </div>
  );
};

export default Dashboard;