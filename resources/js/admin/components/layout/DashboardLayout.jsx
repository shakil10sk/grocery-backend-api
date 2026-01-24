import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Read theme preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      // ignore
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/categories', label: 'Categories', icon: '📁' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    ...(isAdmin() ? [
      { path: '/sliders', label: 'Sliders', icon: '🖼️' },
      { path: '/reviews', label: 'Reviews', icon: '⭐' },
      { path: '/blog/posts', label: 'Blog Posts', icon: '📝' },
      { path: '/blog/categories', label: 'Blog Categories', icon: '📂' },
      { path: '/users', label: 'Users', icon: '👥' },
      { path: '/settings/manage', label: 'Site Settings', icon: '⚙️' },
    ] : []),
    { path: '/settings', label: 'Settings', icon: '🔧' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen || mobileMenuOpen ? 'w-64' : 'w-0 lg:w-20'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
              Grocery Admin
            </h1>
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(false);
                }
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className={`p-3 bg-gray-50 rounded-lg mb-2 ${!sidebarOpen && 'hidden'}`}>
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-xl sm:text-2xl font-semibold">
                {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:inline text-sm text-gray-600 capitalize">
                {user?.roles?.[0]?.name || 'User'}
              </span>

              {/* Theme toggle button */}
              <button
                onClick={toggleTheme}
                aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                title={darkMode ? 'Switch to light' : 'Switch to dark'}
                className="p-2 rounded hover:bg-gray-100"
              >
                {darkMode ? (
                  // Sun icon (light)
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 5a1 1 0 011-1V3a1 1 0 10-2 0v1a1 1 0 011 1zM10 17a1 1 0 011 1v1a1 1 0 10-2 0v-1a1 1 0 011-1zM4.22 5.64a1 1 0 011.4-.08l.7.62a1 1 0 11-1.4 1.44l-.7-.62a1 1 0 01-.0-1.36zM15.68 14.36a1 1 0 011.4-.08l.7.62a1 1 0 11-1.4 1.44l-.7-.62a1 1 0 01-.0-1.36zM3 10a1 1 0 01-1 1H1a1 1 0 110-2h1a1 1 0 011 1zM19 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM4.22 14.36a1 1 0 00-1.4.08l-.7.62a1 1 0 101.4 1.44l.7-.62a1 1 0 00-.0-1.36zM15.68 5.64a1 1 0 00-1.4.08l-.7.62a1 1 0 101.4 1.44l.7-.62a1 1 0 00.0-1.36zM10 7a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                ) : (
                  // Moon icon (dark)
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

