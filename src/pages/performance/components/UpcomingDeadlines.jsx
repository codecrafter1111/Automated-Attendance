import React from 'react';
import Icon from 'components/AppIcon';

const UpcomingDeadlines = ({ deadlines }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-error/20 border-error text-error';
    if (priority === 'medium') return 'bg-warning/20 border-warning text-warning';
    if (priority === 'low') return 'bg-success/20 border-success text-success';
    return 'bg-primary/20 border-primary text-primary';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return 'AlertCircle';
    if (priority === 'medium') return 'Clock';
    if (priority === 'low') return 'CheckCircle';
    return 'Info';
  };

  const getPriorityBadgeColor = (priority) => {
    if (priority === 'high') return 'bg-error/20 text-error border border-error';
    if (priority === 'medium') return 'bg-warning/20 text-warning border border-warning';
    if (priority === 'low') return 'bg-success/20 text-success border border-success';
    return 'bg-primary/20 text-primary border border-primary';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Upcoming Deadlines</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Important dates to remember
        </p>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {deadlines.map((deadline, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${getPriorityColor(
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
                <h4 className="font-bold text-foreground">
                  {deadline.title}
                </h4>
                <p className="text-sm opacity-80 mt-1 text-muted-foreground">
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
          <Icon name="CheckCircle" size={32} className="mx-auto text-success mb-2 opacity-50" />
          <p className="text-muted-foreground">No upcoming deadlines!</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines;
