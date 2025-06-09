
import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Share, 
  Clock,
  Bell,
  Plus,
  Calendar,
  Edit,
  Eye
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SocialIcon from '@/components/common/SocialIcon';

// Sample data for performance overview chart - matching the image
const performanceData = [
  { date: '06/03', engagement: 85, reach: 85, followers: 255 },
  { date: '06/04', engagement: 88, reach: 90, followers: 258 },
  { date: '06/05', engagement: 82, reach: 95, followers: 256 },
  { date: '06/06', engagement: 90, reach: 100, followers: 254 },
  { date: '06/07', engagement: 87, reach: 95, followers: 256 },
  { date: '06/08', engagement: 93, reach: 105, followers: 258 },
  { date: '06/09', engagement: 91, reach: 110, followers: 258 },
];

// Sample data for platform performance chart - matching the image
const platformData = [
  { platform: 'Instagram', engagement: 45, posts: 200 },
  { platform: 'Facebook', engagement: 35, posts: 120 },
  { platform: 'Twitter', engagement: 25, posts: 50 },
  { platform: 'Telegram', engagement: 15, posts: 30 },
];

// Sample data for upcoming posts
const upcomingPosts = [
  {
    id: '1',
    content: 'Exciting news coming soon! Stay tuned for our latest product announcement! #exciting #newproduct',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
    platforms: ['facebook', 'twitter', 'linkedin'],
  },
  {
    id: '2',
    content: 'Check out our latest blog post on social media strategies for 2025! Link in bio.',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 5),
    platforms: ['instagram', 'facebook'],
  },
  {
    id: '3',
    content: 'Watch our CEO\'s interview on the future of digital marketing. #digitalmarketing #interview',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    platforms: ['linkedin', 'twitter'],
  },
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

  // Format date to display relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffHours * 60);
      return `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `in ${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your social media performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
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
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-gray-200 hover:bg-gray-50"
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
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <h3 className="text-2xl font-bold">24,500</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posts</p>
              <h3 className="text-2xl font-bold">342</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Share className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engagement</p>
              <h3 className="text-2xl font-bold">3.7%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reach</p>
              <h3 className="text-2xl font-bold">86.0K</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts and Upcoming Posts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <Select defaultValue="30days">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  domain={[0, 280]}
                />
                <Tooltip />
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
        </Card>

        {/* Upcoming Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Posts</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="space-y-4">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 bg-white">
                <div className="mb-2 flex justify-between items-start">
                  <div className="flex space-x-1">
                    {post.platforms.map((platform) => (
                      <SocialIcon key={platform} platform={platform} size={18} />
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatRelativeTime(post.scheduledDate)}</span>
                  </div>
                </div>
                <p className="text-sm line-clamp-2 mb-3">{post.content}</p>
                <div className="flex justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {post.scheduledDate.toLocaleDateString()} at {post.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Platform Performance Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Platform Performance</h3>
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
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="platform"
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                width={80}
              />
              <Tooltip />
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
      </Card>
    </div>
  );
};

export default Dashboard;
