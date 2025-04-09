
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Image, 
  Video, 
  PenLine,
  Bold, 
  Italic, 
  Underline, 
  Link as LinkIcon,
  Calendar,
  Hash,
  Sparkles,
  Tag,
  ExternalLink,
  Save,
  X,
  Filter
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const platforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'];

const CreatePost: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
  const [postContent, setPostContent] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState('preview');

  const togglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex space-x-4 border-b-2 border-transparent">
          <Button 
            variant={activeTab === 'create' ? 'link' : 'ghost'} 
            onClick={() => setActiveTab('create')}
            className={`px-2 ${activeTab === 'create' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
          >
            Create Post
          </Button>
          <Button 
            variant={activeTab === 'drafts' ? 'link' : 'ghost'} 
            onClick={() => setActiveTab('drafts')}
            className={`px-2 ${activeTab === 'drafts' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
          >
            Drafts
          </Button>
          <Button 
            variant={activeTab === 'feed' ? 'link' : 'ghost'} 
            onClick={() => setActiveTab('feed')}
            className={`px-2 ${activeTab === 'feed' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
          >
            Feed Content
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Bulk Import
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="p-2 border-b bg-gray-50 flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-none ${selectedPlatforms.includes('linkedin') ? 'bg-blue-50' : ''}`}
                >
                  <span className="bg-blue-600 text-white rounded p-1">in</span>
                  <span className="ml-2">Original Draft</span>
                </Button>
              </div>
              
              <div className="p-4">
                <Textarea 
                  placeholder="Start writing post caption or ✨ Generate with AI Pilot" 
                  className="min-h-[180px] mb-2 border-0 focus-visible:ring-0 resize-none"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
              
              <div className="flex border-t p-2 justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-blue-100 text-blue-600">
                    C
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="text-lg">😊</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="font-bold">UTM</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <span className="text-gray-400">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>Add Tags</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              <span>Connect Shortener</span>
              <X className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="flex justify-between gap-2 mt-auto pt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
              <span className="ml-1">
                <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L7.5 9.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Button>
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
              <Calendar className="h-4 w-4" />
              Schedule Post
              <span className="ml-1">
                <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L7.5 9.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="border-b">
                <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="preview" className="flex-1">Post Preview</TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
                    <TabsTrigger value="accounts" className="flex-1">Accounts</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <TabsContent value="preview" className="flex-grow">
                {postContent ? (
                  <div className="border rounded-lg m-4 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">U</span>
                      </div>
                      <div>
                        <p className="font-medium">User Name</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{postContent}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center h-full">
                    <PenLine className="w-12 h-12 mb-3 opacity-20" />
                    <p>Start typing to see a preview</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments" className="flex-grow p-4">
                <div className="text-center py-8 text-gray-500">
                  <p>No comments configuration available</p>
                </div>
              </TabsContent>
              
              <TabsContent value="accounts" className="flex-grow overflow-auto">
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Group</h3>
                    <div className="flex justify-between items-center mb-4">
                      <Input 
                        className="max-w-[240px]" 
                        placeholder="Search an account"
                        startDecorator={<svg className="w-4 h-4" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor"></path></svg>}
                      />
                      <Button variant="ghost" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox id="select-all" />
                          <Label htmlFor="select-all">1 Account selected.</Label>
                        </div>
                        <Button variant="link" className="text-blue-500 h-auto p-0">
                          Clear All
                        </Button>
                      </div>
                      
                      <div className="flex items-center border p-2 rounded-md justify-between bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Checkbox id="linkedin-account" checked />
                          <div className="flex items-center gap-1">
                            <div className="bg-blue-600 text-white rounded p-1 flex items-center justify-center h-6 w-6">
                              in
                            </div>
                            <Label htmlFor="linkedin-account">Darshan</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-center flex-col gap-2">
                      <div className="w-full max-w-[240px]">
                        <img src="/lovable-uploads/dfc9e41d-494b-4d37-97d8-ec2f91b236a4.png" alt="Empty state" className="w-full" />
                      </div>
                      <p className="text-center text-gray-500">You have not created any groups yet</p>
                      <p className="text-center text-sm text-gray-400 max-w-[300px]">
                        You can sort your social media accounts in a Group. Use it for quick selection, filtering and more.
                      </p>
                      <Button className="mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Create Group
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
