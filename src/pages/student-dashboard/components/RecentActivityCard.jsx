import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityCard = ({ recentActivities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance_marked': return 'CheckCircle';
      case 'attendance_missed': return 'XCircle';
      case 'late_arrival': return 'Clock';
      case 'correction_requested': return 'Edit';
      case 'report_generated': return 'FileText';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'attendance_marked': return 'text-success';
      case 'attendance_missed': return 'text-error';
      case 'late_arrival': return 'text-warning';
      case 'correction_requested': return 'text-secondary';
      case 'report_generated': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-primary" />
      </div>
      {recentActivities?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity?.type === 'attendance_marked' ? 'bg-success/10' :
                activity?.type === 'attendance_missed' ? 'bg-error/10' :
                activity?.type === 'late_arrival' ? 'bg-warning/10' :
                activity?.type === 'correction_requested'? 'bg-secondary/10' : 'bg-primary/10'
              }`}>
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={16} 
                  className={getActivityColor(activity?.type)} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">
                  {activity?.title}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity?.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{formatTimeAgo(activity?.timestamp)}</span>
                  </div>
                  {activity?.subject && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Book" size={12} />
                      <span>{activity?.subject}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-smooth">
          View all activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityCard;