
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SocialPlatform } from '@/types';
import SocialIcon from '@/components/common/SocialIcon';
import { toast } from '@/components/ui/use-toast';

interface AccountCardProps {
  platform: SocialPlatform;
  title: string;
  isConnected?: boolean;
  canFollow?: boolean;
  businessOption?: boolean;
  canConnectPage?: boolean;
  canConnectBusiness?: boolean;
  canConnectCreator?: boolean;
  canConnectBlog?: boolean;
  canConnectBoard?: boolean;
  canConnectChannel?: boolean;
  canConnectPersonal?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  platform,
  title,
  isConnected = false,
  canFollow = false,
  businessOption = false,
  canConnectPage = false,
  canConnectBusiness = false,
  canConnectCreator = false,
  canConnectBlog = false,
  canConnectBoard = false,
  canConnectChannel = false,
  canConnectPersonal = false
}) => {
  const handleConnect = (type: string) => {
    toast({
      title: "Connection initiated",
      description: `Connecting to ${title} ${type}...`,
    });
  };
  
  const handleFollow = () => {
    toast({
      title: "Follow toggled",
      description: `Follow setting updated for ${title}`,
    });
  };
  
  return (
    <Card className="p-6 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        <SocialIcon platform={platform} size={32} />
      </div>
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      
      {canConnectProfile && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('profile')}
        >
          Connect Profile
        </Button>
      )}
      
      {canConnectPage && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('page')}
        >
          Connect Page
        </Button>
      )}
      
      {canConnectBusiness && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('business')}
        >
          Connect Business
        </Button>
      )}
      
      {canConnectCreator && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('creator')}
        >
          Connect Creator
        </Button>
      )}
      
      {canConnectBlog && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('blog')}
        >
          Connect Blog
        </Button>
      )}
      
      {canConnectBoard && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('board')}
        >
          Connect Board
        </Button>
      )}
      
      {canConnectChannel && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('channel')}
        >
          Connect Channel
        </Button>
      )}
      
      {canConnectPersonal && (
        <Button 
          variant="outline" 
          className="w-full mb-2" 
          onClick={() => handleConnect('personal')}
        >
          Connect Personal
        </Button>
      )}
      
      {canFollow && (
        <div className="flex items-center mt-2">
          <input 
            type="checkbox" 
            id={`follow-${platform}`} 
            className="mr-2"
            onClick={handleFollow}
          />
          <label htmlFor={`follow-${platform}`} className="text-sm">Follow Us</label>
        </div>
      )}
    </Card>
  );
};

const Accounts: React.FC = () => {
  const [connectedCount, setConnectedCount] = useState(44);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 flex items-center mr-4">
            <ChevronLeft size={16} />
            <span className="text-sm">Accounts</span>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Connect Account</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1 bg-amber-50 border-amber-200 text-amber-700">
              {connectedCount}/50 Accounts Connected
            </Badge>
            <Button variant="outline" size="sm">
              Buy Additional
            </Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </div>
      
      {/* Account Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Facebook */}
        <AccountCard 
          platform="facebook" 
          title="Facebook" 
          canConnectProfile={true}
          canConnectPage={true}
        />
        
        {/* Twitter/X */}
        <AccountCard 
          platform="twitter" 
          title="X" 
          canConnectProfile={true}
          canFollow={true}
        />
        
        {/* LinkedIn */}
        <AccountCard 
          platform="linkedin" 
          title="LinkedIn" 
          canConnectProfile={true}
          canConnectPage={true}
        />
        
        {/* Pinterest */}
        <AccountCard 
          platform="pinterest" 
          title="Pinterest" 
          canConnectBoard={true}
        />
        
        {/* Google Business */}
        <AccountCard 
          platform="google" 
          title="Google Business Profile" 
          canConnectProfile={true}
        />
        
        {/* Instagram */}
        <AccountCard 
          platform="instagram" 
          title="Instagram" 
          canConnectPersonal={true}
          canConnectBusiness={true}
          canConnectCreator={true}
        />
        
        {/* Threads */}
        <AccountCard 
          platform="threads" 
          title="Threads" 
          canConnectProfile={true}
        />
        
        {/* YouTube */}
        <AccountCard 
          platform="youtube" 
          title="YouTube" 
          canConnectChannel={true}
        />
        
        {/* TikTok */}
        <AccountCard 
          platform="tiktok" 
          title="TikTok" 
          canConnectBusiness={true}
        />
        
        {/* Bluesky */}
        <AccountCard 
          platform="bluesky" 
          title="Bluesky" 
          canConnectProfile={true}
          canFollow={true}
        />
        
        {/* Tumblr */}
        <AccountCard 
          platform="tumblr" 
          title="Tumblr" 
          canConnectBlog={true}
        />
      </div>
    </div>
  );
};

export default Accounts;
