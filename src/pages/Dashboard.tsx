
import React from 'react';
import { 
  Layout, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Share, 
  Plus,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/common/MetricCard';
import PlatformStats from '@/components/dashboard/PlatformStats';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for post type chart
const postTypeData = [
  { name: 'Mon', image: 4, text: 2, video: 1 },
  { name: 'Tue', image: 3, text: 1, video: 2 },
  { name: 'Wed', image: 5, text: 3, video: 1 },
  { name: 'Thu', image: 2, text: 4, video: 0 },
  { name: 'Fri', image: 3, text: 2, video: 1 },
  { name: 'Sat', image: 1, text: 1, video: 0 },
  { name: 'Sun', image: 2, text: 0, video: 0 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Welcome to Zenith</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2">
            <Link to="/create-post">
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/schedule">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Posts"
          value="148"
          icon={<Layout className="w-5 h-5 text-white" />}
          change={5.2}
          iconClassName="bg-blue-500 bg-opacity-20"
        />
        <MetricCard
          title="Followers"
          value="24,856"
          icon={<Users className="w-5 h-5 text-white" />}
          change={2.4}
          iconClassName="bg-green-500 bg-opacity-20"
        />
        <MetricCard
          title="Engagement"
          value="3,249"
          icon={<MessageSquare className="w-5 h-5 text-white" />}
          change={-1.8}
          iconClassName="bg-purple-500 bg-opacity-20"
        />
        <MetricCard
          title="Shares"
          value="867"
          icon={<Share className="w-5 h-5 text-white" />}
          change={8.1}
          iconClassName="bg-orange-500 bg-opacity-20"
        />
      </div>
      
      {/* Platform stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <PlatformStats />
        <UpcomingPosts />
      </div>
      
      {/* Content type breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={postTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="image" stackId="a" fill="#8884d8" name="Image Posts" />
                  <Bar dataKey="text" stackId="a" fill="#82ca9d" name="Text Posts" />
                  <Bar dataKey="video" stackId="a" fill="#ffc658" name="Video Posts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    {i % 3 === 0 && <Users className="w-5 h-5 text-blue-500" />}
                    {i % 3 === 1 && <MessageSquare className="w-5 h-5 text-green-500" />}
                    {i % 3 === 2 && <Share className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {i % 3 === 0 && 'New follower on Twitter'}
                      {i % 3 === 1 && 'New comment on your LinkedIn post'}
                      {i % 3 === 2 && 'Your Facebook post was shared'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {30 - i * 5} minutes ago
                    </p>
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
