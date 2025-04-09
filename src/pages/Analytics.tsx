
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, BarChart3, ChevronDown, FileText, AreaChart, Calendar } from 'lucide-react';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';

// Sample data for the charts
const generateLineData = (days = 14) => {
  const data = [];
  let value = 750;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    value = value + Math.floor(Math.random() * 50) - 25;
    if (value < 700) value = 700;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value
    });
  }
  
  return data;
};

const generatePostData = (count = 10) => {
  const data = [];
  const platforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'instagram'];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      id: `post-${i}`,
      content: `Post #${i + 1} about our latest product updates and features`,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      engagement: Math.floor(Math.random() * 100),
      reach: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 50),
    });
  }
  
  return data;
};

const lineData = generateLineData();
const postHistoryData = generatePostData();

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('page-analytics');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground">See here how your social profile has been performing and growing.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select defaultValue="14">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="page-analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="page-analytics" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Page Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="post-analytics" className="flex items-center">
            <AreaChart className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Post Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <ChevronDown className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="post-history" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Post History</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Export</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="page-analytics" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold flex items-center">
              <SocialIcon platform="linkedin" className="mr-2" size={20} />
              LinkedIn Growth
            </h2>
            <p className="text-muted-foreground">How has your profile evolved through time? Hopefully those numbers are going up, up, to the right.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <span>Posts</span>
                  <button className="ml-1 rounded-full bg-gray-200 w-4 h-4 flex items-center justify-center text-gray-600 text-xs">?</button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">0.00</h3>
                <p className="text-xs text-muted-foreground">= 0.00% same as previous similar period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <span>Profile Growth</span>
                  <button className="ml-1 rounded-full bg-gray-200 w-4 h-4 flex items-center justify-center text-gray-600 text-xs">?</button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">0.00</h3>
                <p className="text-xs text-muted-foreground">= 0.00% same as previous similar period</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <span>Connections Count</span>
                  <button className="ml-1 rounded-full bg-gray-200 w-4 h-4 flex items-center justify-center text-gray-600 text-xs">?</button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-bold">783</h3>
                  <Button variant="outline" size="sm">
                    Compare to last period
                  </Button>
                </div>
                
                <div className="h-60 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="post-analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Performance</CardTitle>
              <CardDescription>Analyze how your posts are performing across different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="engagement">
                <TabsList className="mb-4">
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="reach">Reach</TabsTrigger>
                  <TabsTrigger value="clicks">Clicks</TabsTrigger>
                </TabsList>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={lineData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Insights</CardTitle>
              <CardDescription>Discover what type of content performs best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Best Performing Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium line-clamp-1">How to boost your social media engagement in 2023</p>
                              <div className="flex items-center gap-2 mt-1">
                                <SocialIcon platform="facebook" size={14} />
                                <span className="text-xs text-muted-foreground">Posted Apr 10</span>
                                <span className="text-xs font-medium text-green-600">245 engagements</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Posting Time Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">Best times to post for maximum engagement:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <SocialIcon platform="facebook" size={16} />
                              <span className="text-sm font-medium">Facebook</span>
                            </div>
                            <p className="text-xs">Weekdays 1-3 PM</p>
                          </div>
                          <div className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <SocialIcon platform="twitter" size={16} />
                              <span className="text-sm font-medium">Twitter</span>
                            </div>
                            <p className="text-xs">Weekdays 9-11 AM</p>
                          </div>
                          <div className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <SocialIcon platform="linkedin" size={16} />
                              <span className="text-sm font-medium">LinkedIn</span>
                            </div>
                            <p className="text-xs">Tues-Thurs 10-11 AM</p>
                          </div>
                          <div className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <SocialIcon platform="instagram" size={16} />
                              <span className="text-sm font-medium">Instagram</span>
                            </div>
                            <p className="text-xs">Mon & Thurs 11 AM-1 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Type Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { type: 'Images', engagement: 85, reach: 120 },
                            { type: 'Videos', engagement: 65, reach: 100 },
                            { type: 'Text', engagement: 45, reach: 60 },
                            { type: 'Links', engagement: 40, reach: 50 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="engagement" name="Engagement" fill="#8884d8" />
                          <Bar dataKey="reach" name="Reach" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="post-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post History</CardTitle>
              <CardDescription>View and analyze your past social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Platform</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Content</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Engagement</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reach</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Clicks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {postHistoryData.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{post.date}</td>
                          <td className="px-4 py-3">
                            <SocialIcon platform={post.platform} size={18} />
                          </td>
                          <td className="px-4 py-3 text-sm max-w-[300px] truncate">{post.content}</td>
                          <td className="px-4 py-3 text-sm">{post.engagement}</td>
                          <td className="px-4 py-3 text-sm">{post.reach}</td>
                          <td className="px-4 py-3 text-sm">{post.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Analytics</CardTitle>
              <CardDescription>Download your analytics data for offline analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete overview of your social media performance across all platforms.
                    </p>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Engagement Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed engagement metrics for all your posts in CSV format.
                    </p>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Audience Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Demographic and behavioral data about your audience.
                    </p>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
