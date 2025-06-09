
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, MessageSquare, ThumbsUp, Share2, Search, Filter, ChevronDown, Heart, Reply } from 'lucide-react';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';

// Sample engagement data
const generateEngagementData = (count = 15) => {
  const platforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'instagram'];
  const types = ['comment', 'like', 'share', 'mention'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let content = '';
    let username = `user${Math.floor(Math.random() * 1000)}`;
    
    if (type === 'comment') {
      content = 'Great content! I really enjoyed reading this post.';
    } else if (type === 'mention') {
      content = `Hey @yourcompany, check out this article about #marketing!`;
    }
    
    data.push({
      id: `engagement-${i}`,
      type,
      content,
      username,
      platform,
      date,
      handled: Math.random() > 0.5,
    });
  }
  
  return data;
};

const engagementData = generateEngagementData();

const Engagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Filter data based on active tab and search query
  const filteredData = engagementData.filter((item) => {
    if (activeTab === 'all' || item.type === activeTab) {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        item.content.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.platform.toLowerCase().includes(query)
      );
    }
    return false;
  });
  
  // Get icon based on engagement type
  const getEngagementIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: null },
    { id: 'instagram', label: 'Instagram', icon: 'instagram' as const },
    { id: 'twitter', label: 'Twitter', icon: 'twitter' as const },
    { id: 'facebook', label: 'Facebook', icon: 'facebook' as const },
    { id: 'telegram', label: 'Telegram', icon: 'telegram' as const },
  ];

  const handleReplySubmit = (commentId: string) => {
    console.log('Reply submitted for comment:', commentId, 'Reply:', replyText);
    setReplyText('');
    setSelectedComment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Engagement</h1>
          <p className="text-muted-foreground">Respond to comments and messages across your social platforms</p>
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={activeTab === platform.id ? "default" : "outline"}
            className={`gap-2 ${
              activeTab === platform.id 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(platform.id)}
          >
            {platform.icon && <SocialIcon platform={platform.icon} size={16} />}
            <span>{platform.label}</span>
          </Button>
        ))}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Comments</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredData.filter(item => item.type === 'comment').length} comments
              </p>
            </div>
            <Button variant="outline" size="sm">Mark All Read</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select defaultValue="recent">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getEngagementIcon(item.type)}
                      </div>
                      <SocialIcon platform={item.platform} size={18} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{item.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          {item.content && (
                            <p className="text-sm mt-1 text-gray-700">
                              {item.content}
                            </p>
                          )}
                          {!item.content && (
                            <p className="text-sm mt-1 text-gray-500 italic">
                              {capitalizeFirstLetter(item.type)}d your post
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.type === 'comment' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedComment(selectedComment === item.id ? null : item.id)}
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={item.handled ? "text-green-600 border-green-600" : ""}
                          >
                            {item.handled ? (
                              <>
                                <Check className="mr-1 h-4 w-4" />
                                Handled
                              </>
                            ) : (
                              "Mark as Handled"
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {selectedComment === item.id && item.type === 'comment' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">U</span>
                            </div>
                            <div className="flex-1">
                              <Input 
                                placeholder="Write a reply..." 
                                className="text-sm mb-2" 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedComment(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleReplySubmit(item.id)}
                                  disabled={!replyText.trim()}
                                >
                                  Send Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-muted-foreground">No engagements found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Engagement;
