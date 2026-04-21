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
        return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30';
      case 'submitted':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30';
      case 'graded':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-600/20 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/30';
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
    <div className={`bg-white dark:bg-[#1A1A1A] border-2 border-slate-200 dark:border-[#1A1A1A] rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all duration-300 ${
      isOverdue ? 'border-red-300 dark:border-red-600/50 bg-red-50 dark:bg-slate-800' : ''
    }`}>
      {/* Header with Status Badge */}
      <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${getStatusBadgeColor(assignment.status)}`}>
              <Icon name={getStatusIcon(assignment.status)} size={14} />
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
            {isOverdue && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/30 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                Overdue
              </span>
            )}
          </div>
          {userRole !== 'student' && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 w-40">
                  <button
                    onClick={() => {
                      onEdit(assignment);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center space-x-2"
                  >
                    <Icon name="Edit" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onGrade(assignment);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center space-x-2"
                  >
                    <Icon name="CheckCircle" size={14} />
                    <span>Grade Submission</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(assignment.id);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center space-x-2"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {assignment.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {assignment.description}
        </p>
      </div>

      {/* Details */}
      <div className="px-6 py-4 space-y-4 bg-slate-50 dark:bg-[#1A1A1A]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Subject</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{assignment.subject}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Instructor</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{assignment.instructor}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Points</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{assignment.points} pts</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Due Date</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Due Time</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-1">
              <Icon name="Clock" size={14} />
              {assignment.dueTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Status</p>
            <p className={`text-sm font-semibold mt-1 ${
              canSubmitLate ? 'text-amber-600 dark:text-amber-400' : 
              assignment.lateSubmissionAllowed ? 'text-emerald-600 dark:text-emerald-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {canSubmitLate ? 'Late submission allowed' : 
               assignment.lateSubmissionAllowed ? 'Late submission allowed' : 
               'No late submissions'}
            </p>
          </div>
        </div>

        {assignment.status === 'graded' && assignment.grade !== undefined && (
          <div className="mt-3 p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-lg">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <Icon name="Award" size={14} className="inline mr-2" />
              Grade: <span className="font-bold">{assignment.grade}/{assignment.points}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1A1A1A] flex gap-3 bg-slate-50 dark:bg-[#1A1A1A]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="flex-1 justify-center border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
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
