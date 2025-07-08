import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOAuth } from '@/hooks/useOAuth';
import { useToast } from '@/hooks/use-toast';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { Plus, ExternalLink } from 'lucide-react';

interface ConnectSocialAccountProps {
  onSuccess?: () => void;
}

const ConnectSocialAccount: React.FC<ConnectSocialAccountProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<string>('');
  
  const { initiateOAuthFlow, isLoading } = useOAuth();
  const { toast } = useToast();

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'telegram', label: 'Telegram' },
  ];

  const handleConnect = async () => {
    if (!platform) {
      toast({
        title: "Select Platform",
        description: "Please select a platform to connect.",
        variant: "destructive",
      });
      return;
    }

    try {
      await initiateOAuthFlow(platform);
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Connect Social Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Social Media Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <SocialIcon platform={p.value as SocialPlatform} size={16} />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Real OAuth Authentication
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  You'll be redirected to {platform || 'the selected platform'} to authorize access to your account. 
                  This is a secure OAuth flow that allows you to connect your real social media accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              disabled={!platform || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? 'Connecting...' : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Connect with {platform ? platforms.find(p => p.value === platform)?.label : 'OAuth'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectSocialAccount;