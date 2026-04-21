import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewAssignmentDetailsModal = ({ assignment, isOpen, onClose, userRole }) => {
  if (!isOpen || !assignment) return null;

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-card">
            <div>
              <h2 className="text-xl font-bold text-foreground">Assignment Details</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{assignment.title}</h3>
              <p className="text-muted-foreground">{assignment.description}</p>
            </div>

            {/* Status & Alerts */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted/30 text-foreground">
                  {assignment.status}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error/20 text-error">
                    <Icon name="AlertCircle" size={12} className="inline mr-1" />
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/20 rounded-lg p-4 border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Subject</p>
                <p className="text-sm font-semibold text-foreground">{assignment.subject}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Instructor</p>
                <p className="text-sm font-semibold text-foreground">{assignment.instructor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Points</p>
                <p className="text-sm font-semibold text-foreground">{assignment.points} pts</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Due Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Due Time</p>
                <p className="text-sm font-semibold text-foreground">{assignment.dueTime}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Late Submission</p>
                  <p className={`text-sm font-semibold ${assignment.lateSubmissionAllowed ? 'text-success' : 'text-error'}`}>
                  {assignment.lateSubmissionAllowed ? 'Allowed' : 'Not Allowed'}
                </p>
              </div>
            </div>

            {/* Instructions */}
            {assignment.instructions && (
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Instructions</h4>
                <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-wrap border border-border">
                  {assignment.instructions}
                </div>
              </div>
            )}

            {/* Grade Info for Graded Assignments */}
            {assignment.status === 'graded' && assignment.grade !== undefined && (
              <div className="bg-success/15 border border-success/30 rounded-lg p-4">
                <p className="text-sm text-success">
                  <Icon name="Award" size={16} className="inline mr-2" />
                  Grade: <span className="font-bold text-lg">{assignment.grade}/{assignment.points}</span>
                </p>
                {assignment.feedback && (
                  <div className="mt-3 pt-3 border-t border-success/30">
                    <p className="text-xs text-success font-semibold mb-1 uppercase tracking-wide">Instructor Feedback</p>
                    <p className="text-sm text-success">{assignment.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Submission Status Info for Students */}
            {userRole === 'student' && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-primary">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  {assignment.status === 'pending' ? 'Submit your work by the due date.' : 
                   assignment.status === 'submitted' ? 'Your assignment has been submitted. Waiting for grading.' :
                   'Your assignment has been graded.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex gap-3 justify-end bg-card">
            <Button
              variant="default"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAssignmentDetailsModal;
