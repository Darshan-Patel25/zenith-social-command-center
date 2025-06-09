import React, { useState } from 'react';
import {
  Users,
  FileText,
  Share,
  Clock,
  Bell,
  Plus
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';

const performanceData = [
  { date: '06/03', engagement: 90, reach: 95, followers: 260 },
  { date: '06/04', engagement: 88, reach: 98, followers: 258 },
  { date: '06/05', engagement: 85, reach: 102, followers: 256 },
  { date: '06/06', engagement: 92, reach: 105, followers: 254 },
  { date: '06/07', engagement: 89, reach: 108, followers: 256 },
  { date: '06/08', engagement: 95, reach: 112, followers: 258 },
  { date: '06/09', engagement: 93, reach: 115, followers: 260 },
];

const platformData = [
  { platform: 'Instagram', engagement: 45, posts: 200 },
  { platform: 'Facebook', engagement: 35, posts: 120 },
  { platform: 'Twitter', engagement: 25, posts: 50 },
  { platform: 'Telegram', engagement: 15, posts: 30 },
];

const Dashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeframe, setTimeframe] = useState('30d');

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: null },
    { id: 'instagram', label: 'Instagram', icon: 'instagram' as SocialPlatform },
    { id: 'twitter', label: 'Twitter', icon: 'twitter' as SocialPlatform },
    { id: 'facebook', label: 'Facebook', icon: 'facebook' as SocialPlatform },
    { id: 'telegram', label: 'Telegram', icon: 'telegram' as SocialPlatform },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
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
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
            variant={selectedPlatform === platform.id ? "default" : "outline"}
            className={`gap-2 ${selectedPlatform === platform.id
              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            {platform.icon && <SocialIcon platform={platform.icon} size={16} />}
            <span>{platform.label}</span>
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Followers</p>
                <h3 className="text-2xl font-bold text-gray-900">24,500</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Posts</p>
                <h3 className="text-2xl font-bold text-gray-900">342</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Share className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Engagement</p>
                <h3 className="text-2xl font-bold text-gray-900">3.7%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reach</p>
                <h3 className="text-2xl font-bold text-gray-900">86.0K</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Performance Overview</CardTitle>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement %" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="reach" stroke="#82ca9d" name="Reach (K)" />
                  <Line type="monotone" dataKey="followers" stroke="#ffc658" name="Followers (x100)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" name="Engagement %" fill="#8884d8" />
                  <Bar dataKey="posts" name="Posts" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        


      </div>
      <div >
        
        <UpcomingPosts />
      </div>
    </div>
    
  );
};

export default Dashboard;
