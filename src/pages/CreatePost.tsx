
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
  Filter,
  Plus,
  Clock,
  Edit,
  Eye,
  Search,
  Check,
  ChevronDown
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

const accounts = [
  { id: '1', platform: 'instagram' as SocialPlatform, name: 'Arthur Team', username: '@arthurteam', followers: '12.5K', selected: true },
  { id: '2', platform: 'facebook' as SocialPlatform, name: 'Arthur Business', username: 'Arthur Business Page', followers: '8.2K', selected: false },
  { id: '3', platform: 'twitter' as SocialPlatform, name: 'Arthur', username: '@arthur_social', followers: '5.8K', selected: false },
  { id: '4', platform: 'linkedin' as SocialPlatform, name: 'Arthur Professional', username: 'Arthur Team', followers: '3.1K', selected: true },
  { id: '5', platform: 'telegram' as SocialPlatform, name: 'Arthur Channel', username: '@arthur_updates', followers: '2.4K', selected: false },
];

const CreatePost: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedAccounts, setSelectedAccounts] = useState(accounts.filter(acc => acc.selected));
  const [postContent, setPostContent] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState('preview');
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const toggleAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const isSelected = selectedAccounts.some(acc => acc.id === accountId);
    if (isSelected) {
      setSelectedAccounts(selectedAccounts.filter(acc => acc.id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
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
          {/* Account Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Selected Accounts ({selectedAccounts.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAccountSelector(!showAccountSelector)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAccountSelector ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <SocialIcon platform={account.platform} size={16} />
                    <span className="text-sm">{account.name}</span>
                    <button
                      onClick={() => toggleAccount(account.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {showAccountSelector && (
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Input placeholder="Search accounts..." className="max-w-xs" />
                    <Button variant="link" className="text-blue-500">
                      Select All
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => toggleAccount(account.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedAccounts.some(acc => acc.id === account.id)}
                            onChange={() => toggleAccount(account.id)}
                          />
                          <SocialIcon platform={account.platform} size={20} />
                          <div>
                            <p className="font-medium text-sm">{account.name}</p>
                            <p className="text-xs text-gray-500">{account.username} • {account.followers}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card className="border rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="p-2 border-b bg-gray-50 flex">
                <Button variant="ghost" size="sm" className="rounded-none">
                  <span className="bg-blue-600 text-white rounded p-1">📝</span>
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
                  <span className="text-gray-400">{postContent.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Options */}
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
          
          {/* Action Buttons */}
          <div className="flex justify-between gap-2 mt-auto pt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4" />
              Schedule Post
            </Button>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="border-b">
                <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="preview" className="flex-grow p-4">
                    {postContent ? (
                      <div className="space-y-4">
                        {selectedAccounts.map((account) => (
                          <div key={account.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <SocialIcon platform={account.platform} size={20} />
                              <span className="font-medium text-sm">{account.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-xs">A</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{account.name}</p>
                                <p className="text-xs text-gray-500">Just now</p>
                              </div>
                            </div>
                            <p className="text-sm">{postContent}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center h-full">
                        <PenLine className="w-12 h-12 mb-3 opacity-20" />
                        <p>Start typing to see a preview</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="flex-grow p-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="post-immediately">Post Immediately</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch 
                            id="post-immediately" 
                            checked={postNow} 
                            onCheckedChange={setPostNow} 
                          />
                          <span className="text-sm text-gray-500">
                            {postNow ? 'Post now' : 'Schedule for later'}
                          </span>
                        </div>
                      </div>
                      
                      {!postNow && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="schedule-date">Date & Time</Label>
                            <Input 
                              id="schedule-date"
                              type="datetime-local" 
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="utc">UTC</SelectItem>
                                <SelectItem value="est">EST</SelectItem>
                                <SelectItem value="pst">PST</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
