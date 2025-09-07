'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import createApiUrl from '../../lib/api';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required.');
      return;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required.');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Send login request to your Node.js server
      const response = await fetch(createApiUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If login is successful
      console.log('Login successful:', data);
      
      // Dispatch custom event to notify navbar about login
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">

      <div className="max-w-md w-full space-y-6 p-8 rounded-lg shadow-md border border-neutral-700 bg-neutral-900/80" data-no-splash="true">
        <div className="text-center">
          <div className="text-white text-3xl font-bold mb-4">
            Sabrang
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Sign in
          </h2>
        </div>

        {/* Display login error if any */}
        {loginError && (
          <div className="p-3 bg-red-500/20 text-red-300 rounded-md text-sm">
            {loginError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} data-no-splash="true">
          {/* Existing form fields remain the same */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="your@email.com"
              />
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="******"
              />
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
            </div>
          </div>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-neutral-500 focus:ring-neutral-500 border-gray-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-gray-400 hover:text-gray-300">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-700 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition duration-300 ease-in-out ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Social login options */}
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-neutral-900/80 text-gray-400">
            or
          </span>
          <div className="absolute inset-y-0 left-0 w-full border-t border-gray-700 pointer-events-none" aria-hidden="true"></div>
        </div>

        <div className="space-y-3">
          <a 
            href={createApiUrl('/auth/google')} 
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out"
          >
            <img src="/images/google-icon.svg" alt="Google" className="mr-2 h-5 w-5" />
            Sign in with Google
          </a>
          <button className="w-full flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out">
            <img src="/images/facebook-icon.svg" alt="Facebook" className="mr-2 h-5 w-5" />
            Sign in with Facebook
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center text-sm text-gray-400">
          Don't have an account? <a href="/Signup" className="font-medium text-gray-400 hover:text-gray-300">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
