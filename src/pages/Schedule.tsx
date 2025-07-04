
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Grid, List, ChevronLeft, ChevronRight, Calendar as CalendarComponent } from 'lucide-react';
import { format, addMonths, subMonths, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/common/StatusBadge';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePosts, useDeletePost, useUpdatePost } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const { data: posts = [], isLoading } = usePosts();
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const filteredPosts = posts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' 
      ? true 
      : post.platform === selectedPlatform;
    
    return matchesPlatform && (post.status === 'scheduled' || post.status === 'draft');
  });

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter((post) => 
      post.scheduled_date && isSameDay(new Date(post.scheduled_date), date)
    );
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  return (
    <div className="space-y-6 pl-4 pr-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Scheduled Posts</h1>
          <p className="text-muted-foreground">Manage and view your upcoming social media posts</p>
        </div>
        <Button asChild>
          <Link to="/create-post">Create New Post</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Schedule</CardTitle>
          <div className="flex space-x-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'calendar')}>
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center">
                  <Grid className="w-4 h-4 mr-2" />
                  <span>Grid</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          </div>
          
          {viewMode === 'grid' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-lg">Loading...</div>
                </div>
              ) : (
                getCalendarDays().map((day, index) => {
                  const postsForDay = getPostsForDate(day);
                  if (postsForDay.length === 0) return null;
                  
                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium border-b">
                        {format(day, 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="divide-y">
                        {postsForDay.map((post) => (
                          <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col flex-grow space-y-2">
                              <div className="flex items-center space-x-2">
                                <StatusBadge status={post.status as any} />
                                <span className="text-sm text-muted-foreground">
                                  {post.scheduled_date ? format(new Date(post.scheduled_date), 'h:mm a') : 'Draft'}
                                </span>
                              </div>
                              <p className="line-clamp-2">{post.content}</p>
                              <div className="flex space-x-1">
                                <SocialIcon platform={post.platform as SocialPlatform} size={16} />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-center">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/create-post?edit=${post.id}`}>Edit</Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          
          {viewMode === 'calendar' && (
            <div>
              <div className="calendar-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                {Array.from({ length: new Date(getYear(currentDate), getMonth(currentDate), 1).getDay() }, (_, i) => (
                  <div key={`empty-${i}`} className="calendar-day bg-gray-50"></div>
                ))}
                
                {getCalendarDays().map((day, i) => {
                  const postsForDay = getPostsForDate(day);
                  
                  return (
                    <div key={i} className="calendar-day">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{format(day, 'd')}</span>
                        {postsForDay.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {postsForDay.length}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {postsForDay.slice(0, 3).map((post) => {
                          const platformClass = `post-${post.platform}`;
                          
                          return (
                            <div 
                              key={post.id} 
                              className={`calendar-post ${platformClass} cursor-pointer`}
                            >
                              {post.scheduled_date ? format(new Date(post.scheduled_date), 'h:mm a') : 'Draft'} - {post.content.substring(0, 15)}...
                            </div>
                          );
                        })}
                        
                        {postsForDay.length > 3 && (
                          <div className="text-xs text-center text-blue-500 cursor-pointer">
                            +{postsForDay.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
