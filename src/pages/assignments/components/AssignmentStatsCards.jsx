import React from 'react';
import Icon from '../../../components/AppIcon';

const AssignmentStatsCards = ({ totalAssignments, pending, submitted, graded }) => {
  const stats = [
    {
      title: 'Total Assignments',
      value: totalAssignments,
      icon: 'BookOpen',
      color: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-100 dark:bg-[#1A1A1A]',
      borderColor: 'border-slate-200 dark:border-[#1A1A1A]',
      accentColor: 'text-slate-600 dark:text-slate-500'
    },
    {
      title: 'Pending',
      value: pending,
      icon: 'Clock',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-slate-100 dark:bg-[#1A1A1A]',
      borderColor: 'border-slate-200 dark:border-[#1A1A1A]',
      accentColor: 'text-amber-600 dark:text-amber-500'
    },
    {
      title: 'Submitted',
      value: submitted,
      icon: 'CheckCircle',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-slate-100 dark:bg-[#1A1A1A]',
      borderColor: 'border-slate-200 dark:border-[#1A1A1A]',
      accentColor: 'text-blue-600 dark:text-blue-500'
    },
    {
      title: 'Graded',
      value: graded,
      icon: 'Award',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-slate-100 dark:bg-[#1A1A1A]',
      borderColor: 'border-slate-200 dark:border-[#1A1A1A]',
      accentColor: 'text-emerald-600 dark:text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl p-6 transition-all hover:shadow-lg dark:hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.color} mt-3`}>{stat.value}</p>
            </div>
            <Icon name={stat.icon} size={40} className={`${stat.accentColor} opacity-20 dark:opacity-25`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentStatsCards;
