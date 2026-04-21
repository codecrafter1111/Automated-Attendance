import React from 'react';
import Icon from 'components/AppIcon';

const PerformanceStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1B1B1B] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all"
        >
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <Icon name={stat.icon} size={24} className={stat.iconColor} />
            </div>
            {stat.trend && (
              <div className="flex items-center gap-1">
                <Icon name={stat.trendIcon} size={16} className={stat.trendColor} />
                <span className={`text-sm font-semibold ${stat.trendColor}`}>
                  {stat.trend}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
            {stat.label}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {stat.value}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PerformanceStatsCards;
