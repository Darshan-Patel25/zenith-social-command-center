
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SocialIcon from '../common/SocialIcon';
import { SocialPlatform } from '@/types';

// Sample data for upcoming posts
const upcomingPosts = [
  {
    id: '1',
    content: 'Exciting news coming soon! Stay tuned for our latest product announcement that will revolutionize your social media experience! 🚀 #exciting #newproduct #innovation',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    platforms: ['facebook', 'twitter', 'linkedin'] as SocialPlatform[],
    status: 'scheduled' as const,
    type: 'text' as const,
  },
  {
    id: '2',
    content: 'Check out our latest blog post on social media strategies for 2025! Discover the trends that will shape the future of digital marketing. Link in bio. 📈',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
    platforms: ['instagram', 'facebook'] as SocialPlatform[],
    status: 'scheduled' as const,
    type: 'image' as const,
  },
  {
    id: '3',
    content: 'Watch our CEO\'s exclusive interview on the future of digital marketing and AI integration in social media platforms. Don\'t miss this! 🎥 #digitalmarketing #interview #AI',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
    platforms: ['linkedin', 'twitter', 'youtube'] as SocialPlatform[],
    status: 'scheduled' as const,
    type: 'video' as const,
  },
  {
    id: '4',
    content: 'Join us for our live webinar tomorrow at 3 PM EST! We\'ll be discussing best practices for social media automation and engagement strategies. Register now! 📅',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 hours from now
    platforms: ['linkedin', 'facebook', 'twitter'] as SocialPlatform[],
    status: 'draft' as const,
    type: 'text' as const,
  },
];

const UpcomingPosts: React.FC = () => {
  // Format date to display relative time (e.g., "in 2 hours")
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'text': return '📝';
      default: return '📄';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-medium">Upcoming Posts</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {upcomingPosts.filter(post => post.status === 'scheduled').length} posts scheduled
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/schedule">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(post.type)}</span>
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatRelativeTime(post.scheduledDate)}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="text-sm line-clamp-2 mb-3 text-gray-700">{post.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Platforms:</span>
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <SocialIcon key={platform} platform={platform} size={16} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    {post.scheduledDate.toLocaleDateString()} at {post.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {upcomingPosts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming posts scheduled</p>
              <Button asChild className="mt-4">
                <Link to="/create-post">Create your first post</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingPosts;
