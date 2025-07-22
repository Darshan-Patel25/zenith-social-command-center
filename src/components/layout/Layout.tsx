
import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import UserMenu from './UserMenu';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const getTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return '';
    if (path === '/create-post') return '';
    if (path === '/schedule') return '';
    if (path === '/analytics') return '';
    if (path === '/engagement') return '';
    if (path === '/profile') return '';
    if (path === '/content') return '';
    if (path === '/settings') return '';
    
    return 'Trendlyzer';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile 
          ? 'ml-0' 
          : isSidebarOpen 
            ? 'lg:ml-52' 
            : 'ml-16'
      }`}>
      
        
        <main className="flex-1 overflow-auto pl-4 pr-4 pt-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
