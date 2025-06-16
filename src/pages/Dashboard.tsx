
import React from 'react';
import QuickStats from '@/components/dashboard/QuickStats';
import PlatformStats from '@/components/dashboard/PlatformStats';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your social media accounts.</p>
        </div>
      </div>

      <QuickStats />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PlatformStats />
        </div>
        <UpcomingPosts />
      </div>
    </div>
  );
};

export default Dashboard;
