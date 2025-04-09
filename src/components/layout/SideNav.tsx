
import React from 'react';
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
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SideNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      label: 'Dashboard',
      path: '/',
    },
    {
      icon: <PenLine className="w-6 h-6" />,
      label: 'Content',
      path: '/content',
    },
    {
      icon: <Send className="w-6 h-6" />,
      label: 'Create Post',
      path: '/create-post',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Schedule',
      path: '/schedule',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Analytics',
      path: '/analytics',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Engagement',
      path: '/engagement',
    },
    {
      icon: <Bot className="w-6 h-6" />,
      label: 'Telegram Bot',
      path: '/telegram-bot',
    },
    {
      icon: <UserCircle className="w-6 h-6" />,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: 'Settings',
      path: '/settings',
    },
  ];

  return (
    <div className="h-screen fixed left-0 top-0 w-20 lg:w-64 bg-sidebar flex flex-col border-r border-slate-800">
      <div className="p-4 flex items-center justify-center lg:justify-start mb-8">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">Z</span>
          </div>
          <h1 className="ml-2 text-xl font-bold text-white hidden lg:block">Zenith</h1>
        </Link>
      </div>
      
      <nav className="flex-1">
        <ul className="flex flex-col space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-slate-300 hover:bg-sidebar-accent rounded-lg mx-2 transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent text-white"
                )}
              >
                <div className="flex items-center justify-center lg:justify-start w-full">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="ml-3 text-sm hidden lg:block">{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="hidden lg:flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">User Name</p>
            <p className="text-xs text-slate-400">Free Plan</p>
          </div>
        </div>
        
        <div className="lg:hidden flex justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
