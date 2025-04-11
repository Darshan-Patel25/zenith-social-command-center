
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PostPerformanceProps {
  title: string;
  description: string;
}

const PostPerformance: React.FC<PostPerformanceProps> = ({ title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No Data Available
        </div>
      </CardContent>
    </Card>
  );
};

export default PostPerformance;
