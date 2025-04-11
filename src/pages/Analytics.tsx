
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SocialPlatform } from '@/types';
import SocialIcon from '@/components/common/SocialIcon';
import MetricCard from '@/components/analytics/MetricCard';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import EngagementTable from '@/components/analytics/EngagementTable';
import PostPerformance from '@/components/analytics/PostPerformance';
import { ChevronDown, Edit, Share } from 'lucide-react';

// Sample data for the charts
const generateDates = (days = 30) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return dates;
};

const dates = generateDates();

const generatePlatformData = (platform: SocialPlatform | 'all') => {
  const baseFactor = {
    'linkedin': 1,
    'facebook': 1.5,
    'twitter': 0.8,
    'instagram': 2,
    'youtube': 1.2,
    'tiktok': 2.5,
    'all': 1.3
  }[platform] || 1;
  
  return {
    publishingTrend: dates.map(date => ({
      date,
      Text: Math.floor(Math.random() * 5 * baseFactor),
      Image: Math.floor(Math.random() * 3 * baseFactor),
      Video: Math.floor(Math.random() * 2 * baseFactor),
      Article: Math.floor(Math.random() * 1 * baseFactor),
      Document: Math.floor(Math.random() * 1 * baseFactor),
      Others: Math.floor(Math.random() * 0.5 * baseFactor),
    })),
    engagementTrend: dates.map(date => ({
      date,
      Reactions: Math.floor(Math.random() * 50 * baseFactor),
      Comments: Math.floor(Math.random() * 20 * baseFactor),
    })),
    metrics: {
      connections: Math.floor(Math.random() * 1000 * baseFactor) + 500,
      posts: Math.floor(Math.random() * 100 * baseFactor) + 10,
      comments: Math.floor(Math.random() * 200 * baseFactor) + 20,
      reactions: Math.floor(Math.random() * 500 * baseFactor) + 50,
      engagement: Math.floor(Math.random() * 800 * baseFactor) + 100,
    }
  };
};

const platformOptions: SocialPlatform[] = ['linkedin', 'facebook', 'twitter', 'instagram', 'youtube', 'tiktok'];

const Analytics: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('linkedin');
  const [dateRange, setDateRange] = useState('30');
  
  // Get platform data based on selection
  const platformData = generatePlatformData(selectedPlatform);
  
  // Get name of current month and date range
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(dateRange));
  const endDate = new Date();
  
  const formattedStartDate = `Mar 12, 2025`;
  const formattedEndDate = `Apr 10, 2025`;

  // Get platform display name
  const getPlatformDisplayName = (platform: SocialPlatform) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{getPlatformDisplayName(selectedPlatform)} Analytics</h1>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    <div className="flex items-center gap-2">
                      <SocialIcon platform={platform} size={16} />
                      <span className="capitalize">{platform}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex">
              <Button variant="outline" className="rounded-r-none flex gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 flex gap-2">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-sm flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-sm">
              <SocialIcon platform={selectedPlatform} size={20} className="text-white" />
            </div>
            <span className="ml-2 font-medium">Darshan</span>
          </div>
          
          <div className="text-gray-500">
            {formattedStartDate} to {formattedEndDate}
            <span className="text-xs ml-2">(Timezone: Asia/Kolkata)</span>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-4">
          <h2 className="text-2xl font-bold mb-6">{getPlatformDisplayName(selectedPlatform)} Profile - Darshan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <MetricCard 
              title="Total Connections" 
              value={platformData.metrics.connections.toString()} 
            />
            <MetricCard 
              title="Total Posts" 
              value={platformData.metrics.posts.toString()} 
              trend={{ value: "+5", period: "last 30 days" }}
            />
            <MetricCard 
              title="Total Comments" 
              value={platformData.metrics.comments.toString()} 
              trend={{ value: "+8%", period: "last 30 days" }}
            />
            <MetricCard 
              title="Total Reactions" 
              value={platformData.metrics.reactions.toString()} 
              trend={{ value: "+12%", period: "last 30 days" }}
            />
            <MetricCard 
              title="Total Engagement" 
              value={platformData.metrics.engagement.toString()} 
            />
          </div>
          
          <div className="space-y-6 mt-8">
            <AnalyticsChart 
              title="Publishing Trend" 
              description="Review publishing patterns of your post types over time"
              data={platformData.publishingTrend}
              type="line"
              lines={[
                { dataKey: 'Text', color: '#4f46e5', name: 'Text' },
                { dataKey: 'Image', color: '#ec4899', name: 'Image' },
                { dataKey: 'Video', color: '#10b981', name: 'Video' },
                { dataKey: 'Article', color: '#f59e0b', name: 'Article' },
                { dataKey: 'Document', color: '#ef4444', name: 'Document' },
                { dataKey: 'Others', color: '#6b7280', name: 'Others' }
              ]}
            />
            
            <AnalyticsChart 
              title="Engagement Trend" 
              description="Measure engagement patterns through likes and comments over time"
              data={platformData.engagementTrend}
              type="line"
              lines={[
                { dataKey: 'Reactions', color: '#4f46e5', name: 'Reactions' },
                { dataKey: 'Comments', color: '#ec4899', name: 'Comments' }
              ]}
            />
            
            <EngagementTable 
              title="Median and Total Engagement"
              description="Compare median and total engagement performance across different content types"
            />
            
            <PostPerformance
              title="Post Performance"
              description="Analyze individual post performance through likes and comments"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
