import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Classes Today',
      value: metrics?.classesToday,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: metrics?.classesTodayChange,
      changeType: 'neutral'
    },
    {
      title: 'Average Attendance',
      value: `${metrics?.averageAttendance}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: metrics?.attendanceChange,
      changeType: metrics?.attendanceChange > 0 ? 'positive' : 'negative'
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pendingApprovals,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: metrics?.approvalsChange,
      changeType: 'neutral'
    },
    {
      title: 'Active Students',
      value: metrics?.activeStudents,
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: metrics?.studentsChange,
      changeType: metrics?.studentsChange > 0 ? 'positive' : 'negative'
    }
  ];

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive': return 'ArrowUp';
      case 'negative': return 'ArrowDown';
      default: return 'Minus';
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-modal transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            {metric?.change !== undefined && (
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric?.changeType)}`}>
                <Icon name={getChangeIcon(metric?.changeType)} size={14} />
                <span className="font-medium">
                  {Math.abs(metric?.change)}{metric?.title?.includes('%') ? '%' : ''}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{metric?.value}</h3>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryMetrics;