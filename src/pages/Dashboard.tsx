
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
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';

// Sample data for performance overview chart
const performanceData = [
  { date: '06/03', engagement: 90, reach: 95, followers: 260 },
  { date: '06/04', engagement: 88, reach: 98, followers: 258 },
  { date: '06/05', engagement: 85, reach: 102, followers: 256 },
  { date: '06/06', engagement: 92, reach: 105, followers: 254 },
  { date: '06/07', engagement: 89, reach: 108, followers: 256 },
  { date: '06/08', engagement: 95, reach: 112, followers: 258 },
  { date: '06/09', engagement: 93, reach: 115, followers: 260 },
];

// Sample data for platform performance chart
const platformData = [
  { platform: 'Instagram', engagement: 45, posts: 200 },
  { platform: 'Facebook', engagement: 35, posts: 120 },
  { platform: 'Twitter', engagement: 25, posts: 50 },
  { platform: 'Telegram', engagement: 15, posts: 30 },
];

const Dashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: null },
    { id: 'instagram', label: 'Instagram', icon: 'instagram' as const },
    { id: 'twitter', label: 'Twitter', icon: 'twitter' as const },
    { id: 'facebook', label: 'Facebook', icon: 'facebook' as const },
    { id: 'telegram', label: 'Telegram', icon: 'telegram' as const },
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

      {/* Platform Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? "default" : "outline"}
            className={`gap-2 ${
              selectedPlatform === platform.id 
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
      
      {/* Key Metrics Cards */}
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
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview Chart */}
        <Card className="lg:col-span-2 bg-white border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <Select defaultValue="30days">
                <SelectTrigger className="w-[120px] border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="7days">7 days</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="90days">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 280]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    name="Engagement %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10b981' }}
                    name="Reach (K)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#f59e0b' }}
                    name="Followers (x100)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Platform Performance Chart */}
        <Card className="bg-white border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={platformData} 
                  layout="horizontal"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    domain={[0, 250]}
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="platform"
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="engagement" 
                    fill="#8b5cf6" 
                    name="Engagement %"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="posts" 
                    fill="#10b981" 
                    name="Posts"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
