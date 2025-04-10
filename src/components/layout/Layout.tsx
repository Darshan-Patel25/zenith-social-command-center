
import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Detect window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get page title based on current route
  const getTitle = (): string => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/content') return 'Content Management';
    if (path === '/create-post') return 'Create Post';
    if (path === '/schedule') return 'Schedule Posts';
    if (path === '/analytics') return 'Analytics';
    if (path === '/engagement') return 'Engagement';
    if (path === '/telegram-bot') return 'Telegram Bot';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings';
    
    return 'Zenith';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideNav />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-52' : 'ml-16'}`}>
        <Header title={getTitle()} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
