import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConnectSocialAccount } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';
import { Plus } from 'lucide-react';

interface ConnectSocialAccountProps {
  onSuccess?: () => void;
}

const ConnectSocialAccount: React.FC<ConnectSocialAccountProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<string>('');
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [followersCount, setFollowersCount] = useState('');
  
  const connectAccountMutation = useConnectSocialAccount();
  const { toast } = useToast();

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'telegram', label: 'Telegram' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !accountName || !username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await connectAccountMutation.mutateAsync({
        platform,
        account_name: accountName,
        account_username: username,
        followers_count: followersCount ? parseInt(followersCount) : undefined,
      });

      toast({
        title: "Account Connected",
        description: `Successfully connected your ${platform} account.`,
      });

      // Reset form
      setPlatform('');
      setAccountName('');
      setUsername('');
      setFollowersCount('');
      setIsOpen(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect your account. Please try again.",
        variant: "destructive",
      });
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
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

          <div className="space-y-2">
            <Label htmlFor="account-name">Account Name</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., Your Brand Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., yourbrand (without @)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followers">Followers Count (Optional)</Label>
            <Input
              id="followers"
              type="number"
              value={followersCount}
              onChange={(e) => setFollowersCount(e.target.value)}
              placeholder="e.g., 1500"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo connection. In a real application, 
              you would connect through OAuth with the social media platform.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={connectAccountMutation.isPending}>
              {connectAccountMutation.isPending ? 'Connecting...' : 'Connect Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectSocialAccount;