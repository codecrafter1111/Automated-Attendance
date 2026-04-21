import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssignmentCard = ({ 
  assignment, 
  userRole, 
  isSubmitted, 
  onSubmit, 
  onViewDetails, 
  onEdit, 
  onDelete,
  onGrade 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/20 text-warning border border-warning/30';
      case 'submitted':
        return 'bg-primary/20 text-primary border border-primary/30';
      case 'graded':
        return 'bg-success/20 text-success border border-success/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'submitted':
        return 'CheckCircle';
      case 'graded':
        return 'Award';
      default:
        return 'FileText';
    }
  };

  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'pending';
  const canSubmitLate = assignment.lateSubmissionAllowed && !isSubmitted;

  return (
    <div className={`bg-card border-2 border-border rounded-xl overflow-hidden hover:shadow-card hover:shadow-card-hover transition-all duration-300 ${
      isOverdue ? 'border-error bg-error/5' : ''
    }`}>
      {/* Header with Status Badge */}
      <div className="p-6 pb-4 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${getStatusBadgeColor(assignment.status)}`}>
              <Icon name={getStatusIcon(assignment.status)} size={14} />
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
            {isOverdue && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-error/20 text-error border border-error/30 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                Overdue
              </span>
            )}
          </div>
          {userRole !== 'student' && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-card border-2 border-border rounded-lg shadow-card z-10 w-40">
                  <button
                    onClick={() => {
                      onEdit(assignment);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent/50 flex items-center space-x-2"
                  >
                    <Icon name="Edit" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onGrade(assignment);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent/50 flex items-center space-x-2"
                  >
                    <Icon name="CheckCircle" size={14} />
                    <span>Grade Submission</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(assignment.id);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center space-x-2"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
          {assignment.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {assignment.description}
        </p>
      </div>

      {/* Details */}
      <div className="px-6 py-4 space-y-4 bg-muted/30">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Subject</p>
            <p className="text-sm font-semibold text-foreground mt-1">{assignment.subject}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Instructor</p>
            <p className="text-sm font-semibold text-foreground mt-1">{assignment.instructor}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Points</p>
            <p className="text-sm font-semibold text-foreground mt-1">{assignment.points} pts</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Due Date</p>
            <p className="text-sm font-semibold text-foreground mt-1 flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Due Time</p>
            <p className="text-sm font-semibold text-foreground mt-1 flex items-center gap-1">
              <Icon name="Clock" size={14} />
              {assignment.dueTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Status</p>
            <p className={`text-sm font-semibold mt-1 ${
              canSubmitLate ? 'text-warning' : 
              assignment.lateSubmissionAllowed ? 'text-success' :
              'text-error'
            }`}>
              {canSubmitLate ? 'Late submission allowed' : 
               assignment.lateSubmissionAllowed ? 'Late submission allowed' : 
               'No late submissions'}
            </p>
          </div>
        </div>

        {assignment.status === 'graded' && assignment.grade !== undefined && (
          <div className="mt-3 p-3 bg-success/15 border border-success/30 rounded-lg">
            <p className="text-sm text-success">
              <Icon name="Award" size={14} className="inline mr-2" />
              Grade: <span className="font-bold">{assignment.grade}/{assignment.points}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-border flex gap-3 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="flex-1 justify-center"
        >
          <Icon name="Eye" size={14} className="mr-2" />
          View Details
        </Button>

        {userRole === 'student' && assignment.status !== 'graded' ? (
          <Button
            variant={isSubmitted ? 'outline' : 'default'}
            size="sm"
            onClick={() => onSubmit(assignment)}
            disabled={isSubmitted && !canSubmitLate}
            className={`flex-1 justify-center ${isSubmitted && !canSubmitLate ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitted && !canSubmitLate ? (
              <>
                <Icon name="Check" size={14} className="mr-2" />
                Submission Closed
              </>
            ) : (
              <>
                <Icon name="Send" size={14} className="mr-2" />
                {isSubmitted ? 'Resubmit' : 'Submit'}
              </>
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default AssignmentCard;
