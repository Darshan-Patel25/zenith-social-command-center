import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PlatformSelector from '@/components/PlatformSelector';
import { mockData } from '@/data/mockData';
import { Instagram, Twitter, Facebook, Send, Search, MessageSquareText, Heart, Repeat, CheckCheck, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Engage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [commentFilter, setCommentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  const filteredComments = mockData.comments.filter(comment => {
    const matchesPlatform = selectedPlatform === 'all' 
      ? true 
      : comment.platform === selectedPlatform;
    
    const matchesSearch = searchQuery === '' 
      ? true 
      : comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesSearch;
  });

  const handleReply = (commentId: string) => {
    if (replyText.trim() === '') {
      toast({
        title: "Reply cannot be empty",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reply sent",
      description: "Your reply has been published successfully.",
    });
    
    setReplyText('');
    setSelectedComment(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'telegram':
        return <Send className="h-4 w-4 text-sky-500" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <><div className='pl-5 pr-3'>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Engagement</h1>
          <p className="text-muted-foreground">Respond to comments and messages across your social platforms</p>
        </div>
      </div>

      <div className="mb-6">
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelect={setSelectedPlatform}
        />
      </div>

      <Tabs defaultValue="comments" className="mb-6">
        <TabsList>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquareText className="h-4 w-4" /> Comments
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageCircle className="h-4 w-4" /> Messages
          </TabsTrigger>
          <TabsTrigger value="mentions" className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mentions
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Comments</CardTitle>
                <div>
                  <Badge className="bg-primary text-white">{filteredComments.length}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search comments..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <Select defaultValue={commentFilter} onValueChange={setCommentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Comments</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    Mark All Read
                  </Button>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {filteredComments.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No comments found
                  </div>
                ) : (
                  filteredComments.map(comment => (
                    <div 
                      key={comment.id}
                      className={cn(
                        "p-3 border-b hover:bg-gray-50 cursor-pointer",
                        selectedComment === comment.id && "bg-gray-50"
                      )}
                      onClick={() => setSelectedComment(comment.id)}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">{comment.author}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {getPlatformIcon(comment.platform)}
                              <span>{new Date(comment.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-sm line-clamp-2 text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{comment.postPreview}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedComment ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Reply to Comment</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Repeat className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {(() => {
                  const comment = filteredComments.find(c => c.id === selectedComment);
                  if (!comment) return null;
                  
                  return (
                    <>
                      <div className="mb-4 border-b pb-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              {getPlatformIcon(comment.platform)}
                            </div>
                            <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-1">Commenting on:</p>
                          <p className="text-sm">{comment.postPreview}</p>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-base">{comment.content}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <label className="text-sm font-medium mb-2 block">Your Reply</label>
                        <Textarea 
                          placeholder="Write your reply..." 
                          className="min-h-32"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-between mt-4">
                          <Button variant="outline" onClick={() => setSelectedComment(null)}>
                            Cancel
                          </Button>
                          <Button className="bg-zenith-600 hover:bg-zenith-700" onClick={() => handleReply(comment.id)}>
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                  <MessageSquareText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">Select a comment</h3>
                <p className="text-gray-500 mt-1 max-w-md">
                  Choose a comment from the list to view details and respond.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
