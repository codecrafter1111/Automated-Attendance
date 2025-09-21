import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ user = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeMap = {
    '/login': { label: 'Login', icon: 'LogIn' },
    '/student-dashboard': { label: 'Student Dashboard', icon: 'LayoutDashboard' },
    '/faculty-dashboard': { label: 'Faculty Dashboard', icon: 'LayoutDashboard' },
    '/class-attendance-marking': { label: 'Mark Attendance', icon: 'CheckSquare' },
    '/student-attendance-history': { label: 'Attendance History', icon: 'History' },
    '/qr-code-scanner': { label: 'QR Scanner', icon: 'QrCode' }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Always add home/dashboard as first item
    if (user && location?.pathname !== '/login') {
      const dashboardPath = user?.role === 'student' ? '/student-dashboard' : '/faculty-dashboard';
      const dashboardLabel = user?.role === 'student' ? 'Student Dashboard' : 'Faculty Dashboard';
      
      breadcrumbs?.push({
        label: dashboardLabel,
        path: dashboardPath,
        icon: 'LayoutDashboard',
        isHome: true
      });
    }

    // Add current page if it's not the dashboard
    const currentRoute = routeMap?.[location?.pathname];
    if (currentRoute && !breadcrumbs?.some(b => b?.path === location?.pathname)) {
      breadcrumbs?.push({
        label: currentRoute?.label,
        path: location?.pathname,
        icon: currentRoute?.icon,
        isCurrent: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1 || location?.pathname === '/login') {
    return null;
  }

  const handleNavigation = (path) => {
    if (path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="sticky top-16 z-10 bg-background border-b border-border py-3">
      <div className="px-6">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs?.map((breadcrumb, index) => (
            <li key={breadcrumb?.path} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="mx-2 text-muted-foreground" 
                />
              )}
              
              {breadcrumb?.isCurrent ? (
                <span className="flex items-center space-x-2 text-foreground font-medium">
                  <Icon name={breadcrumb?.icon} size={16} />
                  <span className="hidden sm:inline">{breadcrumb?.label}</span>
                  <span className="sm:hidden">
                    {breadcrumb?.label?.split(' ')?.pop()}
                  </span>
                </span>
              ) : (
                <button
                  onClick={() => handleNavigation(breadcrumb?.path)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Icon name={breadcrumb?.icon} size={16} />
                  <span className="hidden sm:inline">{breadcrumb?.label}</span>
                  <span className="sm:hidden">
                    {breadcrumb?.isHome ? 'Home' : breadcrumb?.label?.split(' ')?.pop()}
                  </span>
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation;