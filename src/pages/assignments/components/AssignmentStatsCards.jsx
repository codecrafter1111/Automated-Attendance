import React from 'react';
import Icon from '../../../components/AppIcon';

const AssignmentStatsCards = ({ totalAssignments, pending, submitted, graded }) => {
  const stats = [
    {
      title: 'Total Assignments',
      value: totalAssignments,
      icon: 'BookOpen',
      color: 'text-foreground',
      bgColor: 'bg-muted/30',
      borderColor: 'border-border',
      accentColor: 'text-muted-foreground'
    },
    {
      title: 'Pending',
      value: pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-muted/30',
      borderColor: 'border-border',
      accentColor: 'text-warning'
    },
    {
      title: 'Submitted',
      value: submitted,
      icon: 'CheckCircle',
      color: 'text-primary',
      bgColor: 'bg-muted/30',
      borderColor: 'border-border',
      accentColor: 'text-primary'
    },
    {
      title: 'Graded',
      value: graded,
      icon: 'Award',
      color: 'text-success',
      bgColor: 'bg-muted/30',
      borderColor: 'border-border',
      accentColor: 'text-success'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 transition-all hover:shadow-card hover:shadow-card-hover`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.color} mt-3`}>{stat.value}</p>
            </div>
            <Icon name={stat.icon} size={40} className={`${stat.accentColor} opacity-20`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentStatsCards;
