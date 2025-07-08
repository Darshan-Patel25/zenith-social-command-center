import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback, isLoading, error } = useOAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      // Extract platform from state token stored in localStorage
      const platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'telegram'];
      let detectedPlatform = 'twitter'; // default
      
      for (const platform of platforms) {
        const storedState = localStorage.getItem(`oauth_state_${platform}`);
        if (storedState === state) {
          detectedPlatform = platform;
          break;
        }
      }
      
      handleOAuthCallback(code, state, detectedPlatform).then((result) => {
        if (result) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      });
    }
  }, [searchParams, handleOAuthCallback, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle>Connecting Account</CardTitle>
            <CardDescription>
              Please wait while we connect your social media account...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Connection Failed</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/profile')}>
              Return to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Account Connected!</CardTitle>
            <CardDescription>
              Your social media account has been successfully connected.
              Redirecting you back to your profile...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Processing...</CardTitle>
          <CardDescription>
            Processing your authentication request...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default OAuthCallback;