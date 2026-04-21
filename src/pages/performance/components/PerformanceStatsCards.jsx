import React from 'react';
import Icon from 'components/AppIcon';

const PerformanceStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all"
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
          <p className="text-muted-foreground text-sm font-medium mb-1">
            {stat.label}
          </p>
          <h3 className="text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </h3>
          <p className="text-xs text-muted-foreground">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PerformanceStatsCards;
