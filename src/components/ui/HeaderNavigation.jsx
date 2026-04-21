import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

const HeaderNavigation = ({ user = null, onNavigate = () => {}, currentPath = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: user?.role === 'student' ? '/student-dashboard' : '/faculty-dashboard',
      icon: 'LayoutDashboard',
      roles: ['student', 'faculty'],
      tooltip: 'View attendance overview'
    },
    {
      label: 'Mark Attendance',
      path: '/class-attendance-marking',
      icon: 'CheckSquare',
      roles: ['faculty'],
      tooltip: 'Mark student attendance'
    },
    {
      label: 'QR Scanner',
      path: '/qr-code-scanner',
      icon: 'QrCode',
      roles: ['student'],
      tooltip: 'Scan attendance QR code'
    },
    {
      label: 'History',
      path: '/student-attendance-history',
      icon: 'History',
      roles: ['student', 'faculty'],
      tooltip: 'View attendance history'
    },
    {
      label: 'Events',
      path: '/events',
      icon: 'Calendar',
      roles: ['student', 'faculty'],
      tooltip: 'Campus events and activities'
    },
    {
      label: 'Assignments',
      path: '/assignments',
      icon: 'BookOpen',
      roles: ['student', 'faculty'],
      tooltip: 'View and manage assignments'
    },
    {
      label: 'Performance',
      path: '/performance',
      icon: 'TrendingUp',
      roles: ['student'],
      tooltip: 'View academic performance'
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    !user?.role || item?.roles?.includes(user?.role)
  );

  const handleNavigation = (path) => {
    navigate(path);
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-md border-b border-border shadow-card">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation(user?.role === 'student' ? '/student-dashboard' : '/faculty-dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-smooth group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hidden sm:inline">AttendEase</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {filteredNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location?.pathname === item?.path
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95'
                }`}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="h-8 w-px bg-border"></div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/account-settings')}
                  iconName="Settings"
                  iconSize={16}
                  title="Account Settings"
                  className="hover:bg-muted hover:scale-105"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconSize={16}
                  className="hover:bg-error/10 hover:text-error"
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[1050] bg-black bg-opacity-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-[1100] w-80 h-full bg-card border-l border-border md:hidden animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <nav className="p-6 space-y-2">
              {filteredNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-smooth ${
                    location?.pathname === item?.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </button>
              ))}
            </nav>

            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleNavigation('/account-settings')}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    iconName="LogOut"
                    iconPosition="left"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default HeaderNavigation;