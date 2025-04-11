
import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Send,
  MessageCircle,
  CircleDot,
  Plus,
  Briefcase
} from 'lucide-react';
import { SocialPlatform } from '@/types';

interface SocialIconProps {
  platform: SocialPlatform;
  size?: number;
  color?: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  size = 24, 
  color,
  className = ""
}) => {
  const iconProps = {
    size,
    className: `social-icon ${className}`,
    color
  };

  switch (platform) {
    case 'facebook':
      return <Facebook {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    case 'twitter':
      return <Twitter {...iconProps} className={`${iconProps.className} text-sky-500`} />;
    case 'linkedin':
      return <Linkedin {...iconProps} className={`${iconProps.className} text-blue-700`} />;
    case 'instagram':
      return <Instagram {...iconProps} className={`${iconProps.className} text-pink-600`} />;
    case 'youtube':
      return <Youtube {...iconProps} className={`${iconProps.className} text-red-600`} />;
    case 'telegram':
      return <Send {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    case 'pinterest':
      return <CircleDot {...iconProps} className={`${iconProps.className} text-red-500`} />;
    case 'tumblr':
      return <MessageCircle {...iconProps} className={`${iconProps.className} text-blue-800`} />;
    case 'tiktok':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`${iconProps.className} text-black`}
        >
          <path d="M9 12a4 4 0 1 0 4 4V8c0-1.5 1.5-3 3-3h0" />
          <path d="M12 8c1.5 0 3-1.5 3-3" />
          <path d="M15 8c1.5 0 3 1.5 3 3" />
        </svg>
      );
    case 'google':
      return <Briefcase {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    case 'threads':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${iconProps.className} text-black`}
        >
          <path d="M12 6C6.47715 6 2 10.4772 2 16V19C2 20.6569 3.34315 22 5 22C6.65685 22 8 20.6569 8 19V16C8 12.6863 9.79086 10 12 10C14.2091 10 16 12.6863 16 16V19C16 20.6569 17.3431 22 19 22C20.6569 22 22 20.6569 22 19V16C22 10.4772 17.5228 6 12 6Z" />
          <path d="M12 6V2" />
        </svg>
      );
    case 'bluesky':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${iconProps.className} text-blue-400`}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 18a6 6 0 0 0 0-12v12z" />
        </svg>
      );
    default:
      return <Plus {...iconProps} />;
  }
};

export default SocialIcon;
