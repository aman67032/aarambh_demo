'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import createApiUrl from '../../lib/api';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSignupError('');

    // Validation
    let isValid = true;

    if (!username) {
      setUsernameError('Username is required.');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      setIsLoading(true);
      
      const response = await fetch(createApiUrl('/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          referralCode: referralCode || undefined // Send undefined if empty
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // If signup is successful
      console.log('Signup successful:', data);
      
      // Redirect to login page or dashboard
      router.push('/Login');
      
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
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
            Sign up
          </h2>
        </div>

        {/* Display signup error if any */}
        {signupError && (
          <div className="p-3 bg-red-500/20 text-red-300 rounded-md text-sm">
            {signupError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} data-no-splash="true">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-4">

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm"
                placeholder="username"
              />
              {usernameError && <p className="mt-1 text-sm text-red-500">{usernameError}</p>}
            </div>

            {/* Email */}
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
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm"
                placeholder="your@email.com"
              />
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm"
                placeholder="******"
              />
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm"
                placeholder="******"
              />
              {confirmPasswordError && <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>}
            </div>

            {/* Referral Code */}
            <div>
              <label htmlFor="referral-code" className="block text-sm font-medium text-gray-300">
                Referral Code (Optional)
              </label>
              <input
                id="referral-code"
                name="referral-code"
                type="text"
                autoComplete="off"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm"
                placeholder="Enter referral code"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition duration-300 ease-in-out ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black/50 text-gray-400">or</span>
          <div className="absolute inset-y-0 left-0 w-full border-t border-gray-700 pointer-events-none" aria-hidden="true"></div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button 
            type="button"
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out"
          >
            <img src="/images/google-icon.svg" alt="Google" className="mr-2 h-5 w-5" />
            Sign up with Google
          </button>
          <button 
            type="button"
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out"
          >
            <img src="/images/facebook-icon.svg" alt="Facebook" className="mr-2 h-5 w-5" />
            Sign up with Facebook
          </button>
        </div>

        {/* Login Redirect */}
        <div className="text-center text-sm text-gray-400">
          Already have an account? <a href="/Login" className="font-medium text-gray-400 hover:text-gray-300">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;