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
        },
        {
          title: 'Account Settings',
          description: 'Manage your profile and biometric authentication',
          icon: 'Settings',
          path: '/account-settings',
          color: 'bg-muted',
          iconColor: 'currentColor'
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
        },
        {
          title: 'Account Settings',
          description: 'Manage your profile and biometric authentication',
          icon: 'Settings',
          path: '/account-settings',
          color: 'bg-muted',
          iconColor: 'currentColor'
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
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 rounded-xl p-6 shadow-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {getTimeBasedGreeting()}, {user?.name || 'User'}! 👋
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              {user?.role === 'student' ?'🎯 Ready to mark your attendance today?' :'📊 Manage your class attendance efficiently'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-xl flex items-center justify-center shadow-card hover:shadow-lg transition-shadow">
              <Icon 
                name={user?.role === 'student' ? 'GraduationCap' : 'Users'} 
                size={40} 
                className="text-primary" 
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
            className={`bg-gradient-to-br ${card?.urgent ? 'from-primary/10 to-primary/5' : 'from-card to-card/50'} rounded-xl p-6 shadow-card border-2 ${card?.urgent ? 'border-primary/20 hover:border-primary/40' : 'border-border hover:border-primary/50'} hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
            onClick={() => handleNavigation(card?.path)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-14 h-14 ${card?.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${card?.urgent ? 'shadow-primary/50' : ''}`}>
                    <Icon name={card?.icon} size={28} color={card?.iconColor} />
                  </div>
                  {card?.urgent && (
                    <span className="px-3 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold rounded-full shadow-md">
                      ⚡ Quick Action
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {card?.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {card?.description}
                </p>

                {card?.stats && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-success font-bold text-sm">{card?.stats}</span>
                  </div>
                )}
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={24} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 flex-shrink-0 mt-1" 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 shadow-card border-2 border-border hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <Icon name="BarChart3" size={24} className="text-primary" />
            <span>📊 Quick Stats</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/student-attendance-history')}
            iconName="ExternalLink"
            iconSize={16}
            className="hover:bg-primary/10"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary/40 transition-colors hover:shadow-card text-center">
            <div className="text-3xl font-bold text-primary">
              {attendanceStats?.present || '0'}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-2">✓ Present</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 rounded-lg hover:border-warning/40 transition-colors hover:shadow-card text-center">
            <div className="text-3xl font-bold text-warning">
              {attendanceStats?.absent || '0'}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-2">✕ Absent</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 rounded-lg hover:border-success/40 transition-colors hover:shadow-card text-center">
            <div className="text-3xl font-bold text-success">
              {attendanceStats?.percentage || '0'}%
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-2">📈 Rate</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-lg hover:border-secondary/40 transition-colors hover:shadow-card text-center">
            <div className="text-3xl font-bold text-secondary">
              {attendanceStats?.totalClasses || '0'}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-2">📅 Classes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;