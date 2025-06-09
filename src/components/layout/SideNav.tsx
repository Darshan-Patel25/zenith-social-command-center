
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenLine, 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  UserCircle, 
  Settings,
  Send,
  ChevronLeft,
  ChevronRight,
  Menu,
  FileText,
  Bot,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SocialIcon from '@/components/common/SocialIcon';
import { SocialPlatform } from '@/types';

const SideNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  
  // Check window width on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const mainNavItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Content',
      path: '/content',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Schedule',
      path: '/schedule',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Analytics',
      path: '/analytics',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Engage',
      path: '/engagement',
    },
    {
      icon: <Bot className="w-5 h-5" />,
      label: 'Telegram Bot',
      path: '/telegram-bot',
    },
    {
      icon: <UserCircle className="w-5 h-5" />,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      path: '/settings',
    },
  ];

  const platforms: { platform: SocialPlatform; connected: boolean }[] = [
    { platform: 'instagram', connected: true },
    { platform: 'twitter', connected: true },
    { platform: 'facebook', connected: true },
    { platform: 'telegram', connected: true },
  ];

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 bg-sidebar flex flex-col border-r border-slate-800 transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 flex items-center justify-between mb-6">
        <div className="flex items-center relative w-full">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            {isOpen && <h1 className="ml-2 text-xl font-bold text-white">Trendlyzer</h1>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-slate-300 hover:text-white p-0 h-8 w-8 absolute right-0"
            onClick={toggleSidebar}
          >
            {isOpen ? <Menu className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Menu Section */}
      {isOpen && (
        <div className="px-3 mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            MAIN MENU
          </h3>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col space-y-1 px-2">
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-slate-300 hover:bg-sidebar-accent rounded-md transition-colors",
                  location.pathname === item.path && "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3 text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Platforms Section */}
        {isOpen && (
          <div className="px-3 mt-8 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              PLATFORMS
            </h3>
            <div className="space-y-2">
              {platforms.map(({ platform, connected }) => (
                <div 
                  key={platform}
                  className="flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SocialIcon platform={platform} size={20} />
                    <span className="text-sm capitalize">{platform}</span>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    connected ? "bg-green-500" : "bg-red-500"
                  )} />
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 mt-auto border-t border-slate-700">
        <div className={cn(
          "flex items-center",
          !isOpen && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {isOpen && (
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Arthur Team</p>
                  <p className="text-xs text-slate-400">Premium Account</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
