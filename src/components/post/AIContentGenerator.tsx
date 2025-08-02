import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  selectedPlatforms?: string[];
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ onContentGenerated, selectedPlatforms = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [platform, setPlatform] = useState('general');
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('post');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [generatedVariations, setGeneratedVariations] = useState<string[]>([]);
  const { toast } = useToast();

  const quickPrompts = [
    "Announce a new product feature",
    "Share industry insights",
    "Celebrate team achievements",
    "Ask for customer feedback",
    "Share behind-the-scenes content",
    "Promote an upcoming event",
    "Share a motivational quote",
    "Highlight customer success story"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for AI content generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: {
          prompt: prompt.trim(),
          platform,
          tone,
          contentType,
          length
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.content) {
        setGeneratedContent(data.content);
        
        // Generate additional variations
        const variations = [];
        for (let i = 0; i < 2; i++) {
          const { data: variationData } = await supabase.functions.invoke('generate-ai-content', {
            body: {
              prompt: `Create a different variation of: ${prompt.trim()}`,
              platform,
              tone: i === 0 ? 'casual' : 'creative',
              contentType,
              length
            }
          });
          if (variationData?.content) {
            variations.push(variationData.content);
          }
        }
        setGeneratedVariations(variations);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = (content: string = generatedContent) => {
    onContentGenerated(content);
    setIsOpen(false);
    setPrompt('');
    setGeneratedContent('');
    setGeneratedVariations([]);
    toast({
      title: "Content added",
      description: "AI-generated content has been added to your post.",
    });
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const resetForm = () => {
    setPrompt('');
    setGeneratedContent('');
    setGeneratedVariations([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="AI Content Generator">
          <Wand2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Content Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Prompts */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Prompts</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.slice(0, 4).map((quickPrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 justify-start"
                  onClick={() => handleQuickPrompt(quickPrompt)}
                >
                  {quickPrompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspiring">Inspiring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Social Post</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="tip">Tip/Advice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Length</Label>
              <Select value={length} onValueChange={(value: 'short' | 'medium' | 'long') => setLength(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Your Prompt</Label>
            <Textarea
              placeholder="Describe what you want to post about..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Generated Content</Label>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUseContent()} className="flex-1">
                    Use This Content
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>

              {/* Variations */}
              {generatedVariations.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alternative Versions</Label>
                  {generatedVariations.map((variation, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm whitespace-pre-wrap mb-2">{variation}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUseContent(variation)}
                      >
                        Use This Version
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reset Button */}
          {(generatedContent || prompt) && (
            <Button 
              variant="ghost" 
              onClick={resetForm}
              className="w-full"
            >
              Start Over
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIContentGenerator;