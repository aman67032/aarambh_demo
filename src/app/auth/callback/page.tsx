'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token from URL parameters
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token in a cookie with proper settings for production
      const isProduction = window.location.hostname !== 'localhost';
      const cookieOptions = [
        `jwt=${token}`,
        'path=/',
        `max-age=${60 * 60 * 24}`,
        isProduction ? 'secure' : '',
        isProduction ? 'SameSite=None' : 'SameSite=Lax'
      ].filter(Boolean).join('; ');
      
      document.cookie = cookieOptions;
      
      // Dispatch custom event to notify navbar about login
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      // If no token, redirect to login page with error
      router.push('/Login?error=auth_failed');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
