import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardNavigation = ({ user = null, attendanceStats = null }) => {
  const navigate = useNavigate();

  const getNavigationCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Scan QR Code',
          description: 'Mark your attendance by scanning QR code',
          icon: 'QrCode',
          path: '/qr-code-scanner',
          color: 'bg-primary',
          iconColor: 'white',
          urgent: true
        },
        {
          title: 'Attendance History',
          description: 'View your attendance records and statistics',
          icon: 'History',
          path: '/student-attendance-history',
          color: 'bg-secondary',
          iconColor: 'white',
          stats: attendanceStats?.totalClasses ? `${attendanceStats?.present}/${attendanceStats?.totalClasses}` : null
        }
      ];
    }

    if (user?.role === 'faculty') {
      return [
        {
          title: 'Mark Attendance',
          description: 'Take attendance for your classes',
          icon: 'CheckSquare',
          path: '/class-attendance-marking',
          color: 'bg-primary',
          iconColor: 'white',
          urgent: true
        },
        {
          title: 'Attendance Reports',
          description: 'View detailed attendance analytics',
          icon: 'BarChart3',
          path: '/student-attendance-history',
          color: 'bg-success',
          iconColor: 'white',
          stats: attendanceStats?.activeClasses ? `${attendanceStats?.activeClasses} Classes` : null
        }
      ];
    }

    return [];
  };

  const navigationCards = getNavigationCards();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card rounded-lg p-6 shadow-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {getTimeBasedGreeting()}, {user?.name || 'User'}!
            </h2>
            <p className="text-muted-foreground mt-1">
              {user?.role === 'student' ?'Ready to mark your attendance today?' :'Manage your class attendance efficiently'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Icon 
                name={user?.role === 'student' ? 'GraduationCap' : 'Users'} 
                size={32} 
                className="text-muted-foreground" 
              />
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationCards?.map((card, index) => (
          <div
            key={card?.path}
            className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-modal transition-smooth cursor-pointer group"
            onClick={() => handleNavigation(card?.path)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 ${card?.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-smooth`}>
                    <Icon name={card?.icon} size={24} color={card?.iconColor} />
                  </div>
                  {card?.urgent && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      Quick Action
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                  {card?.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {card?.description}
                </p>

                {card?.stats && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-success font-medium">{card?.stats}</span>
                  </div>
                )}
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={20} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
              />
            </div>
          </div>
        ))}
      </div>
      {/* Recent Activity or Quick Stats */}
      <div className="bg-card rounded-lg p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/student-attendance-history')}
            iconName="ExternalLink"
            iconSize={16}
          >
            View Details
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {attendanceStats?.present || '0'}
            </div>
            <div className="text-sm text-muted-foreground">Present</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {attendanceStats?.absent || '0'}
            </div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {attendanceStats?.percentage || '0'}%
            </div>
            <div className="text-sm text-muted-foreground">Attendance</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {attendanceStats?.totalClasses || '0'}
            </div>
            <div className="text-sm text-muted-foreground">Total Classes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;