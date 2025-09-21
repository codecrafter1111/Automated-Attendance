import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Overall Attendance',
      value: `${stats?.overallPercentage}%`,
      icon: 'TrendingUp',
      color: stats?.overallPercentage >= 75 ? 'text-success' : stats?.overallPercentage >= 60 ? 'text-warning' : 'text-error',
      bgColor: stats?.overallPercentage >= 75 ? 'bg-success/10' : stats?.overallPercentage >= 60 ? 'bg-warning/10' : 'bg-error/10',
      description: `${stats?.totalPresent}/${stats?.totalClasses} classes`
    },
    {
      title: 'Subjects at Risk',
      value: stats?.subjectsAtRisk,
      icon: 'AlertTriangle',
      color: stats?.subjectsAtRisk > 0 ? 'text-error' : 'text-success',
      bgColor: stats?.subjectsAtRisk > 0 ? 'bg-error/10' : 'bg-success/10',
      description: 'Below 75% attendance'
    },
    {
      title: 'Classes This Month',
      value: stats?.thisMonthClasses,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: `${stats?.thisMonthPresent} attended`
    },
    {
      title: 'Current Semester',
      value: `${stats?.semesterPercentage}%`,
      icon: 'BookOpen',
      color: stats?.semesterPercentage >= 75 ? 'text-success' : 'text-warning',
      bgColor: stats?.semesterPercentage >= 75 ? 'bg-success/10' : 'bg-warning/10',
      description: 'Semester progress'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${card?.color}`}>
                {card?.value}
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {card?.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {card?.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStatsCards;