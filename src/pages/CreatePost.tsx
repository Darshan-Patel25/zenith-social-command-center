
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
  Settings, 
  Plus, 
  Calendar
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

const platforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'];

const CreatePost: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['facebook', 'twitter', 'linkedin']);
  const [postContent, setPostContent] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [variation, setVariation] = useState(1);

  const togglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Create your post</h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedPlatforms(platforms)}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPlatforms([])}
                >
                  Select None
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {platforms.map((platform) => (
                  <div 
                    key={platform} 
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer transition-all ${
                      selectedPlatforms.includes(platform) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <SocialIcon platform={platform} size={20} />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Variation {variation}</p>
                </div>
                
                <Textarea 
                  placeholder="What do you want to share?" 
                  className="min-h-[120px] mb-2"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    <span>Add Photo</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>Add Video</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <span>Add Link</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border">
                <Settings className="w-5 h-5 text-gray-500" />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="p-1 h-auto w-auto">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-auto w-auto">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-auto w-auto">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded text-xs font-semibold">New</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setVariation(variation + 1)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Variation
              </Button>
              <Button variant="outline">
                <PenLine className="w-4 h-4 mr-2" />
                Customize for each profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">When to post</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={postNow} 
                    onCheckedChange={setPostNow} 
                    id="post-now"
                  />
                  <Label htmlFor="post-now">Post now (when saving)</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="post-time" 
                  className="h-4 w-4" 
                  checked={!postNow}
                  onChange={() => setPostNow(!postNow)}
                />
                <Label htmlFor="post-time" className="flex items-center space-x-2">
                  <span>Post at a specific time</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">i</span>
                </Label>
              </div>
              
              {!postNow && (
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add a posting time
                </Button>
              )}
              
              <Separator />
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">i</span>
                  <Label>Category</Label>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Content without a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Content without a category</SelectItem>
                    <SelectItem value="curated">Curated</SelectItem>
                    <SelectItem value="engaging">Engaging Posts</SelectItem>
                    <SelectItem value="blogs">Our Blogs and Videos</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="re-queue" />
                <div className="flex items-center space-x-2">
                  <Label htmlFor="re-queue">Re-queue after posting</Label>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">i</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Expire post</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="expire-after" className="h-4 w-4" />
                <Label htmlFor="expire-after" className="flex items-center space-x-2">
                  <span>Expire after it was published</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">i</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input 
                  type="number" 
                  className="w-20" 
                  defaultValue="1"
                  disabled
                />
                <span>times</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="expire-at" className="h-4 w-4" />
                <Label htmlFor="expire-at" className="flex items-center space-x-2">
                  <span>Expire at a specific date</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs">i</span>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-medium">Post preview</h3>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
              <div className="p-4 text-sm text-gray-500 italic">
                *Social networks tweak their design all the time. This is our best estimate of how this will look like once published.
              </div>
              
              <div className="p-4">
                {postContent ? (
                  <div className="border rounded-lg p-4">
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
                  <div className="text-center py-8 text-gray-500">
                    <PenLine className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Start typing to see a preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex items-center justify-between gap-4">
            <Button variant="outline">Cancel</Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm">as</span>
                <Switch id="approve" defaultChecked />
                <span className="text-sm">Approved</span>
              </div>
              <Button className="px-8">Save post</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
