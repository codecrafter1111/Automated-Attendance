import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SubmitAssignmentModal = ({ assignment, isOpen, onClose, onSubmit, isLoading }) => {
  const [submissionData, setSubmissionData] = useState({
    files: [],
    comments: '',
    fileNames: []
  });

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionData(prev => ({
      ...prev,
      files: [...prev.files, ...files],
      fileNames: [...prev.fileNames, ...files.map(f => f.name)]
    }));
  };

  const handleRemoveFile = (index) => {
    setSubmissionData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      fileNames: prev.fileNames.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submissionData.files.length === 0 && !submissionData.comments) {
      alert('Please upload files or add comments');
      return;
    }
    onSubmit({
      assignmentId: assignment.id,
      ...submissionData
    });
  };

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-card">
            <div>
              <h2 className="text-xl font-bold text-foreground">Submit Assignment</h2>
              <p className="text-sm text-muted-foreground mt-1">Upload your work and submit</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Assignment Info */}
            <div className="bg-muted/20 rounded-xl p-4 space-y-2 border border-border">
              <h3 className="font-bold text-foreground">{assignment.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-semibold text-foreground">{assignment.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Points</p>
                  <p className="font-semibold text-foreground">{assignment.points} pts</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-semibold text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Time</p>
                  <p className="font-semibold text-foreground">{assignment.dueTime}</p>
                </div>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="bg-warning/20 border-2 border-warning rounded-lg p-4">
                  <p className="text-sm text-warning">
                  <Icon name="AlertCircle" size={16} className="inline mr-2" />
                  This assignment is overdue. Late submission {assignment.lateSubmissionAllowed ? 'is allowed' : 'is NOT allowed'}.
                </p>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary hover:bg-muted/20 transition-all cursor-pointer group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Icon name="Upload" size={32} className="mx-auto text-muted-foreground group-hover:text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, etc.</p>
                </label>
              </div>

              {/* Uploaded Files List */}
              {submissionData.fileNames.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Uploaded Files:</p>
                  {submissionData.fileNames.map((fileName, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground truncate">{fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-error hover:text-error transition-colors"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={submissionData.comments}
                onChange={(e) => setSubmissionData(prev => ({
                  ...prev,
                  comments: e.target.value
                }))}
                placeholder="Add any comments or notes about your submission..."
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-primary">
                <Icon name="Info" size={14} className="inline mr-2" />
                Your submission will be recorded and sent to your instructor for grading.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-border flex gap-3 justify-end sticky bottom-0 bg-card">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isLoading}
            >
              <Icon name="Send" size={14} className="mr-2" />
              Submit Assignment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitAssignmentModal;
