import React from 'react';
import Icon from 'components/AppIcon';

const RecentAchievements = ({ achievements }) => {
  const getAchievementIcon = (type) => {
    if (type === 'attendance') return 'CheckCircle';
    if (type === 'academic') return 'Award';
    if (type === 'performance') return 'Zap';
    return 'Trophy';
  };

  const getAchievementColor = (type) => {
    if (type === 'attendance') return 'bg-success/20 text-success';
    if (type === 'academic') return 'bg-warning/20 text-warning';
    if (type === 'performance') return 'bg-primary/20 text-primary';
    return 'bg-secondary/20 text-secondary';
  };

  const getBadgeColor = (badge) => {
    if (badge === 'attendance') return 'bg-success/20 text-success';
    if (badge === 'academic') return 'bg-warning/20 text-warning';
    if (badge === 'high') return 'bg-error/20 text-error';
    return 'bg-muted text-foreground';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Recent Achievements</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your academic milestones
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:shadow-lg transition-all bg-muted/20"
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg flex-shrink-0 ${getAchievementColor(achievement.type)}`}>
              <Icon name={getAchievementIcon(achievement.type)} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-foreground">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getBadgeColor(achievement.badge)}`}>
                    {achievement.badge}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {achievement.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAchievements;
