"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createApiUrl from '../src/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(createApiUrl('/api/user'), {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const userData = await response.json();
      
      // Check admin requirement
      if (requireAdmin && !userData.isAdmin) {
        setError('Admin access required');
        router.push('/');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication required');
      router.push('/Login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-4 bg-red-500/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
