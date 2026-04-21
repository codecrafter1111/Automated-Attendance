import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateAssignmentModal = ({ assignment, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    instructor: '',
    points: 100,
    dueDate: '',
    dueTime: '23:59',
    lateSubmissionAllowed: false,
    instructions: '',
    attachments: []
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        subject: assignment.subject || '',
        instructor: assignment.instructor || '',
        points: assignment.points || 100,
        dueDate: assignment.dueDate || '',
        dueTime: assignment.dueTime || '23:59',
        lateSubmissionAllowed: assignment.lateSubmissionAllowed || false,
        instructions: assignment.instructions || '',
        attachments: assignment.attachments || []
      });
    }
  }, [assignment, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      points: parseInt(formData.points)
    };
    if (assignment?.id) {
      submitData.id = assignment.id;
    }
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-card">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {assignment?.id ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {assignment?.id ? 'Update assignment details' : 'Create a new assignment for students'}
              </p>
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
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Assignment Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Binary Tree Implementation"
                required
              />
            </div>

            {/* Description & Subject Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the assignment"
                  rows="3"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>
            </div>

            {/* Instructor & Points Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Instructor *
                </label>
                <Input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Points *
                </label>
                <Input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Due Date & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Due Date *
                </label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Due Time *
                </label>
                <Input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Detailed instructions for students..."
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              />
            </div>

            {/* Late Submission Checkbox */}
            <div className="flex items-center gap-3 bg-muted/20 rounded-lg p-4 border border-border">
              <input
                type="checkbox"
                id="lateSubmission"
                name="lateSubmissionAllowed"
                checked={formData.lateSubmissionAllowed}
                onChange={handleInputChange}
                className="w-4 h-4 rounded cursor-pointer accent-primary"
              />
              <label htmlFor="lateSubmission" className="cursor-pointer flex-1">
                <p className="text-sm font-semibold text-foreground">Allow Late Submissions</p>
                <p className="text-xs text-muted-foreground">Students can submit after the due date</p>
              </label>
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
              <Icon name="Save" size={14} className="mr-2" />
              {assignment?.id ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAssignmentModal;
