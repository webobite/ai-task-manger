import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { ProjectTree } from './ProjectTree';
import { useProjectStore } from '../store/projectStore';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useProjectStore(state => state.user);
  const logout = useProjectStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect if no user
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {/* Desktop menu button */}
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <span className="font-semibold">Task Manager</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/analytics')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Analytics
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-40 md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <ProjectTree />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          className={`hidden md:block border-r bg-white ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300`}
        >
          {isSidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <ProjectTree />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-4 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 