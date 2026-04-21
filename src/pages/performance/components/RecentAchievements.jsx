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
    if (type === 'attendance') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
    if (type === 'academic') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
    if (type === 'performance') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
  };

  const getBadgeColor = (badge) => {
    if (badge === 'attendance') return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300';
    if (badge === 'academic') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    if (badge === 'high') return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1A1A1A] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Achievements</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Your academic milestones
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-slate-300 dark:border-[#1A1A1A] hover:shadow-lg dark:hover:shadow-md transition-all bg-slate-100 dark:bg-[#1A1A1A]"
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg flex-shrink-0 ${getAchievementColor(achievement.type)}`}>
              <Icon name={getAchievementIcon(achievement.type)} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-300 dark:border-slate-600">
                <div className="flex gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getBadgeColor(achievement.badge)}`}>
                    {achievement.badge}
                  </span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
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
