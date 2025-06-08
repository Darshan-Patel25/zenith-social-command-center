
import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Share, 
  Eye,
  Plus,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SocialIcon from '@/components/common/SocialIcon';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';
import PlatformStats from '@/components/dashboard/PlatformStats';
import { SocialPlatform } from '@/types';

// Sample data for performance chart
const performanceData = [
  { date: '06/02', engagement: 2.1, reach: 85, followers: 245 },
  { date: '06/03', engagement: 2.5, reach: 95, followers: 248 },
  { date: '06/04', engagement: 2.2, reach: 88, followers: 250 },
  { date: '06/05', engagement: 2.8, reach: 102, followers: 255 },
  { date: '06/06', engagement: 2.4, reach: 92, followers: 258 },
  { date: '06/07', engagement: 2.6, reach: 98, followers: 260 },
  { date: '06/08', engagement: 2.7, reach: 105, followers: 262 },
];

// Sample data for platform performance bar chart
const platformBarData = [
  { platform: 'Instagram', engagement: 4.2, posts: 180 },
  { platform: 'Facebook', engagement: 3.1, posts: 95 },
  { platform: 'Twitter', engagement: 2.8, posts: 45 },
  { platform: 'Telegram', engagement: 1.9, posts: 15 },
];

const Dashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialPlatform>('all');
  const [timeRange, setTimeRange] = useState('30');

  const platforms = [
    { value: 'all', label: 'All Platforms', icon: '🌐' },
    { value: 'instagram', label: 'Instagram', icon: 'instagram' as SocialPlatform },
    { value: 'twitter', label: 'Twitter', icon: 'twitter' as SocialPlatform },
    { value: 'facebook', label: 'Facebook', icon: 'facebook' as SocialPlatform },
    { value: 'telegram', label: 'Telegram', icon: 'telegram' as SocialPlatform },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your social media performance</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Link to="/create-post">
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Platform Filters */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.value}
            variant={selectedPlatform === platform.value ? "default" : "outline"}
            className={`gap-2 ${
              selectedPlatform === platform.value 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedPlatform(platform.value as 'all' | SocialPlatform)}
          >
            {platform.icon === '🌐' ? (
              <span>🌐</span>
            ) : (
              <SocialIcon platform={platform.icon} size={16} />
            )}
            <span>{platform.label}</span>
          </Button>
        ))}
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-2xl font-bold">24,500</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posts</p>
                <p className="text-2xl font-bold">342</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Share className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">3.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reach</p>
                <p className="text-2xl font-bold">86.0K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Performance Overview</CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Engagement %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Reach (K)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Followers (x100)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformBarData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="platform" 
                    tick={{ fontSize: 12 }} 
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#8b5cf6" name="Engagement %" />
                  <Bar dataKey="posts" fill="#10b981" name="Posts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Platform Stats */}
      <PlatformStats />
      
      {/* Upcoming Posts */}
      <UpcomingPosts />
    </div>
  );
};

export default Dashboard;
