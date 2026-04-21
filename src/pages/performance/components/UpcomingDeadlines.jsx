import React from 'react';
import Icon from 'components/AppIcon';

const UpcomingDeadlines = ({ deadlines }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300';
    if (priority === 'medium') return 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300';
    if (priority === 'low') return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return 'AlertCircle';
    if (priority === 'medium') return 'Clock';
    if (priority === 'low') return 'CheckCircle';
    return 'Info';
  };

  const getPriorityBadgeColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600';
    if (priority === 'medium') return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600';
    if (priority === 'low') return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600';
    return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600';
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1B1B1B] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Important dates to remember
        </p>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {deadlines.map((deadline, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md dark:hover:shadow-lg ${getPriorityColor(
              deadline.priority
            )}`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <Icon name={getPriorityIcon(deadline.priority)} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {deadline.title}
                </h4>
                <p className="text-sm opacity-80 mt-1 text-slate-700 dark:text-slate-300">
                  {deadline.subject}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-current opacity-30">
                <div className="flex gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPriorityBadgeColor(deadline.priority)}`}>
                    {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}
                  </span>
                </div>
                <span className="text-xs font-medium opacity-80">
                  Due: {deadline.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {deadlines.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={32} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-2 opacity-50" />
          <p className="text-slate-600 dark:text-slate-400">No upcoming deadlines!</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines;
