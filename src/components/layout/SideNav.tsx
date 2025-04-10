import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenLine, 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  Bot, 
  UserCircle, 
  Settings,
  Send,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  
  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/',
    },
    {
      icon: <PenLine className="w-5 h-5" />,
      label: 'Content',
      path: '/content',
    },
    {
      icon: <Send className="w-5 h-5" />,
      label: 'Create Post',
      path: '/create-post',
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
      label: 'Engagement',
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

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 bg-sidebar flex flex-col border-r border-slate-800 transition-all duration-300",
      isOpen ? "w-52" : "w-16"
    )}>
      <div className="p-4 flex items-center justify-between mb-6">
        <div className="flex items-center relative w-full">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">Z</span>
            </div>
            {isOpen && <h1 className="ml-2 text-xl font-bold text-white">Zenith</h1>}
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
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-slate-300 hover:bg-sidebar-accent rounded-md transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent text-white"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3 text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className={cn("flex items-center", !isOpen && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-slate-400">Free Plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
