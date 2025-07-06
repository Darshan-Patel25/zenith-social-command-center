
import React, { useState, useEffect } from 'react';
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
  Calendar as CalendarIcon,
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
  Send,
  Upload,
  File
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import PlatformSelector from '@/components/post/PlatformSelector';
import ImageUpload from '@/components/post/ImageUpload';
import FileUpload from '@/components/post/FileUpload';
import EmojiPicker from '@/components/post/EmojiPicker';
import AIContentGenerator from '@/components/post/AIContentGenerator';
import { useCreatePost, usePosts, useUpdatePost } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
  const [postContent, setPostContent] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState('preview');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [showHashtagDialog, setShowHashtagDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const { data: posts = [] } = usePosts();
  const { toast } = useToast();

  // Check if we're in edit mode
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const postToEdit = posts.find(p => p.id === editId);
      if (postToEdit) {
        setIsEditMode(true);
        setEditingPostId(editId);
        setPostContent(postToEdit.content);
        setSelectedPlatforms([postToEdit.platform as SocialPlatform]);
        if (postToEdit.scheduled_date) {
          const scheduledDateTime = new Date(postToEdit.scheduled_date);
          setScheduledDate(scheduledDateTime);
          setScheduledTime(format(scheduledDateTime, 'HH:mm'));
          setPostNow(false);
        }
      }
    }
  }, [searchParams, posts]);

  const handleCreatePost = async (isDraft = false) => {
    if (!postContent.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    let scheduledDateTime: string | undefined;
    if (!postNow && !isDraft) {
      if (!scheduledDate) {
        toast({
          title: "Schedule date required",
          description: "Please select a date and time for scheduling.",
          variant: "destructive",
        });
        return;
      }
      
      const [hours, minutes] = scheduledTime.split(':');
      const dateTime = new Date(scheduledDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      if (dateTime <= new Date()) {
        toast({
          title: "Invalid schedule time",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }
      
      scheduledDateTime = dateTime.toISOString();
    }

    try {
      if (isEditMode && editingPostId) {
        // Update existing post
        await updatePostMutation.mutateAsync({
          id: editingPostId,
          content: postContent,
          status: isDraft ? 'draft' : (postNow ? 'published' : 'scheduled'),
          scheduled_date: scheduledDateTime,
        });
        
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully.",
        });
        
        navigate('/content');
      } else {
        // Create new posts
        for (const platform of selectedPlatforms) {
          await createPostMutation.mutateAsync({
            content: postContent,
            platform,
            status: isDraft ? 'draft' : (postNow ? 'published' : 'scheduled'),
            scheduled_date: scheduledDateTime,
          });
        }

        toast({
          title: isDraft ? "Draft saved" : "Post created",
          description: isDraft 
            ? "Your post has been saved as a draft."
            : postNow 
              ? "Your post has been published successfully."
              : "Your post has been scheduled successfully.",
        });

        // Reset form
        setPostContent('');
        setScheduledDate(undefined);
        setScheduledTime('09:00');
        setPostNow(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSchedulePost = () => {
    setPostNow(false);
    setShowScheduleDialog(true);
  };

  const handleConfirmSchedule = () => {
    setShowScheduleDialog(false);
    handleCreatePost(false);
  };

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent(prev => prev + emoji);
  };

  const handleAIContentGenerated = (content: string) => {
    setPostContent(content);
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags(prev => [...prev, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (index: number) => {
    setHashtags(prev => prev.filter((_, i) => i !== index));
  };

  const handleInsertHashtags = () => {
    const hashtagText = hashtags.map(tag => `#${tag}`).join(' ');
    setPostContent(prev => prev + (prev ? ' ' : '') + hashtagText);
    setShowHashtagDialog(false);
  };

  const handleImageButtonClick = () => {
    setActiveRightTab('media');
  };

  const handleVideoButtonClick = () => {
    setActiveRightTab('media');
  };

  const drafts = posts.filter(p => p.status === 'draft');

  return (
    <>
      <div className="border-b bg-white items-center justify-between px-2 sm:px-4 h-12">
        <h1 className="text-xl sm:text-2xl font-bold pl-2 sm:pl-4">
          {isEditMode ? 'Edit Post' : 'Create Post'}
        </h1>
      </div>
      
      <div className="flex flex-col h-full px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4 sm:mb-6 gap-4">
          <div className="flex space-x-2 sm:space-x-4 border-b-2 border-transparent overflow-x-auto">
            <Button 
              variant={activeTab === 'create' ? 'link' : 'ghost'} 
              onClick={() => setActiveTab('create')}
              className={`px-2 whitespace-nowrap ${activeTab === 'create' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
            >
              Create Post
            </Button>
            <Button 
              variant={activeTab === 'drafts' ? 'link' : 'ghost'} 
              onClick={() => setActiveTab('drafts')}
              className={`px-2 whitespace-nowrap ${activeTab === 'drafts' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
            >
              Drafts ({drafts.length})
            </Button>
            <Button 
              variant={activeTab === 'feed' ? 'link' : 'ghost'} 
              onClick={() => setActiveTab('feed')}
              className={`px-2 whitespace-nowrap ${activeTab === 'feed' ? 'border-b-2 border-primary -mb-[2px]' : ''}`}
            >
              Feed Content
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              Bulk Import
            </Button>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {activeTab === 'create' && (
          <>
            <div className="mb-4 sm:mb-6">
              <Label className="text-sm font-medium mb-2 block">Select Platforms</Label>
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-grow">
              <div className="lg:col-span-2 space-y-4">
                <Card className="border rounded-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-2 border-b bg-gray-50 flex overflow-x-auto">
                      {selectedPlatforms.map((platform) => (
                        <Button 
                          key={platform}
                          variant="ghost" 
                          size="sm" 
                          className="rounded-none bg-blue-50 whitespace-nowrap"
                        >
                          <div className="flex items-center gap-2">
                            <SocialIcon platform={platform} size={16} />
                            <span>Original Draft</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <Textarea 
                        placeholder="Start writing post caption or ✨ Generate with AI Pilot" 
                        className="min-h-[150px] sm:min-h-[180px] mb-2 border-0 focus-visible:ring-0 resize-none text-sm sm:text-base"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex border-t p-2 justify-between items-center">
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
                          onClick={handleImageButtonClick}
                          title="Add Image"
                        >
                          <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
                          onClick={handleVideoButtonClick}
                          title="Add Video"
                        >
                          <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                        <AIContentGenerator onContentGenerated={handleAIContentGenerated} />
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                          <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Dialog open={showHashtagDialog} onOpenChange={setShowHashtagDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
                              title="Add Hashtags"
                            >
                              <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add Hashtags</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="hashtag-input">Enter hashtag (without #)</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="hashtag-input"
                                    value={hashtagInput}
                                    onChange={(e) => setHashtagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                                    placeholder="e.g. socialmedia"
                                  />
                                  <Button onClick={handleAddHashtag}>Add</Button>
                                </div>
                              </div>
                              {hashtags.length > 0 && (
                                <div className="space-y-2">
                                  <Label>Added hashtags:</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {hashtags.map((tag, index) => (
                                      <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                        <span>#{tag}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 p-0"
                                          onClick={() => handleRemoveHashtag(index)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button variant="outline" onClick={() => setShowHashtagDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleInsertHashtags}>
                                Insert Hashtags
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">{postContent.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Button variant="ghost" className="flex items-center gap-1 justify-start">
                    <Tag className="h-4 w-4" />
                    <span>Add Tags</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1 justify-start">
                    <ExternalLink className="h-4 w-4" />
                    <span>Connect Shortener</span>
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-auto pt-6">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-center"
                    onClick={() => handleCreatePost(true)}
                    disabled={createPostMutation.isPending}
                  >
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </Button>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 justify-center"
                      onClick={() => handleCreatePost(false)}
                      disabled={createPostMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                      {createPostMutation.isPending || updatePostMutation.isPending ? 'Publishing...' : 'Post Now'}
                    </Button>
                    <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 justify-center"
                          onClick={handleSchedulePost}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          Schedule Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Post</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="schedule-date">Select Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !scheduledDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={scheduledDate}
                                  onSelect={setScheduledDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="schedule-time">Select Time</Label>
                            <Input
                              id="schedule-time"
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleConfirmSchedule}>
                              Schedule Post
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="border-b">
                      <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
                        <TabsList className="w-full">
                          <TabsTrigger value="preview" className="flex-1 text-xs sm:text-sm">Preview</TabsTrigger>
                          <TabsTrigger value="media" className="flex-1 text-xs sm:text-sm">Media</TabsTrigger>
                          <TabsTrigger value="accounts" className="flex-1 text-xs sm:text-sm">Accounts</TabsTrigger>
                        </TabsList>
                      
                         <TabsContent value="preview" className="flex-grow p-3 sm:p-4">
                           {postContent || uploadedImages.length > 0 ? (
                             <div className="border rounded-lg p-3 sm:p-4">
                               <div className="flex items-center space-x-2 mb-3">
                                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                   <span className="text-blue-600 font-semibold text-sm">U</span>
                                 </div>
                                 <div>
                                   <p className="font-medium text-sm sm:text-base">User Name</p>
                                   <p className="text-xs text-gray-500">Just now</p>
                                 </div>
                               </div>
                               {postContent && <p className="text-sm sm:text-base mb-3">{postContent}</p>}
                               {uploadedImages.length > 0 && (
                                 <div className="grid grid-cols-2 gap-2 mb-3">
                                   {uploadedImages.slice(0, 4).map((image, index) => (
                                     <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                       <img
                                         src={URL.createObjectURL(image)}
                                         alt={`Preview ${index + 1}`}
                                         className="w-full h-full object-cover"
                                       />
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           ) : (
                             <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center h-full">
                               <PenLine className="w-8 h-8 sm:w-12 sm:h-12 mb-3 opacity-20" />
                               <p className="text-sm">Start typing or add media to see a preview</p>
                             </div>
                           )}
                         </TabsContent>
                        
                        <TabsContent value="media" className="flex-grow p-3 sm:p-4">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-3 text-sm sm:text-base">Upload Images</h3>
                              <ImageUpload
                                onImageUpload={handleImageUpload}
                                uploadedImages={uploadedImages}
                                onRemoveImage={handleRemoveImage}
                              />
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-3 text-sm sm:text-base">Upload Files</h3>
                              <FileUpload
                                onFileUpload={handleFileUpload}
                                uploadedFiles={uploadedFiles}
                                onRemoveFile={handleRemoveFile}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="accounts" className="flex-grow overflow-auto">
                          <div className="p-3 sm:p-4">
                            <div className="mb-4">
                              <h3 className="font-medium mb-2 text-sm sm:text-base">Group</h3>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                                <div className="relative w-full sm:max-w-[240px]">
                                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input 
                                    className="pl-8 text-sm" 
                                    placeholder="Search an account"
                                  />
                                </div>
                                <Button variant="ghost" size="icon">
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="select-all" />
                                    <Label htmlFor="select-all" className="text-sm">1 Account selected.</Label>
                                  </div>
                                  <Button variant="link" className="text-blue-500 h-auto p-0 text-sm">
                                    Clear All
                                  </Button>
                                </div>
                                
                                <div className="flex items-center border p-2 rounded-md justify-between bg-gray-50">
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="linkedin-account" checked />
                                    <div className="flex items-center gap-1">
                                      <div className="bg-blue-600 text-white rounded p-1 flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6">
                                        <span className="text-xs">in</span>
                                      </div>
                                      <Label htmlFor="linkedin-account" className="text-sm">Darshan</Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-8">
                              <div className="flex items-center justify-center flex-col gap-2">
                                <div className="w-full max-w-[200px] sm:max-w-[240px]">
                                  <img src="/lovable-uploads/dfc9e41d-494b-4d37-97d8-ec2f91b236a4.png" alt="Empty state" className="w-full" />
                                </div>
                                <p className="text-center text-gray-500 text-sm">You have not created any groups yet</p>
                                <p className="text-center text-xs sm:text-sm text-gray-400 max-w-[300px]">
                                  You can sort your social media accounts in a Group. Use it for quick selection, filtering and more.
                                </p>
                                <Button className="mt-2 text-sm">
                                  <Plus className="h-4 w-4 mr-1" /> Create Group
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Your Drafts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <Card key={draft.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{draft.platform}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingPostId(draft.id);
                          setPostContent(draft.content);
                          setSelectedPlatforms([draft.platform as SocialPlatform]);
                          setActiveTab('create');
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm line-clamp-3">{draft.content}</p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(draft.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
              {drafts.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>No drafts found. Start creating content!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="text-center py-8 text-gray-500">
            <p>Feed content feature coming soon!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePost;
