import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../lib/api';
import axios from 'axios';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting login process...', { email });
    
    try {
      setIsLoading(true);
      setError('');

      // Log the request payload
      console.log('📤 Sending login request with payload:', { email, password: '***' });

      const response = await authApi.login({ email, password });
      console.log('📥 Received login response:', JSON.stringify(response, null, 2));

      // Validate response structure
      if (!response) {
        throw new Error('No response received from server');
      }

      // Validate token
      if (!response.token) {
        console.error('❌ No token in response:', response);
        throw new Error('No authentication token received');
      }

      // Validate user data
      if (!response.id || !response.email || !response.name) {
        console.error('❌ Invalid user data in response:', response);
        throw new Error('Invalid user data received');
      }

      // Store token
      console.log('💾 Storing auth token...');
      localStorage.setItem('token', response.token);

      // Store user info in auth store
      console.log('💾 Storing user info...', {
        id: response.id,
        email: response.email,
        name: response.name
      });
      
      setUser({
        id: response.id,
        email: response.email,
        name: response.name,
      });

      console.log('🎯 Login successful, navigating to dashboard...');
      onSuccess?.();
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Network response:', error.response?.data);
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else if (error.response?.status === 401) {
          setError('Invalid email or password');
        } else if (error.response?.status === 404) {
          setError('Login service not found');
        } else if (!error.response) {
          setError('Network error - please check your connection');
        } else {
          setError('An error occurred during login');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 