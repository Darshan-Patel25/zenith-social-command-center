import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ onContentGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const { toast } = useToast();

  // Sample AI-generated content (in a real app, this would call an AI service)
  const sampleContent = [
    "🚀 Excited to share our latest product update! We've been working hard to bring you features that make your workflow smoother and more efficient. #ProductUpdate #Innovation",
    "💡 Just finished an amazing brainstorming session with the team. Sometimes the best ideas come from collaborative thinking! What's your favorite way to generate new ideas? #Teamwork #Innovation",
    "🌟 Grateful for all the positive feedback we've received this week! Your support motivates us to keep pushing boundaries and delivering excellence. #Grateful #Community",
    "📈 Data shows that businesses using our platform see 40% improvement in productivity. Ready to transform your workflow? Let's chat! #Productivity #Growth",
    "🎯 Success isn't just about reaching your goals - it's about the journey and what you learn along the way. What's one thing you've learned recently? #Growth #Learning"
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
    
    // Simulate AI generation delay
    setTimeout(() => {
      const randomContent = sampleContent[Math.floor(Math.random() * sampleContent.length)];
      setGeneratedContent(randomContent);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUseContent = () => {
    onContentGenerated(generatedContent);
    setIsOpen(false);
    setPrompt('');
    setGeneratedContent('');
    toast({
      title: "Content added",
      description: "AI-generated content has been added to your post.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Content Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter a prompt for AI content generation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>

          {generatedContent && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{generatedContent}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUseContent} className="flex-1">
                  Use This Content
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIContentGenerator;