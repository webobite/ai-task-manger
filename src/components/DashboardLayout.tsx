import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../lib/api';

export function DashboardLayout() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const clearUser = useAuthStore(state => state.clearUser);

  const handleLogout = () => {
    authApi.logout();
    clearUser();
    navigate('/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Add search or other header content here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative" ref={profileRef}>
                <div>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>

                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Add your page content here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 