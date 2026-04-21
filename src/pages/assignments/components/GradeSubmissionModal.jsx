import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GradeSubmissionModal = ({ assignment, isOpen, onClose, onSave, isLoading }) => {
  const [gradeData, setGradeData] = useState({
    grade: assignment?.grade || 0,
    feedback: assignment?.feedback || '',
    submittedBy: assignment?.submittedBy || 'Student Name'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gradeData.grade < 0 || gradeData.grade > assignment.points) {
      alert(`Grade must be between 0 and ${assignment.points}`);
      return;
    }
    onSave({
      assignmentId: assignment.id,
      ...gradeData
    });
  };

  if (!isOpen || !assignment) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-start justify-between sticky top-0 bg-white">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Grade Submission</h2>
              <p className="text-sm text-slate-600 mt-1">Evaluate student submission and provide feedback</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Assignment Info */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">Assignment</p>
              <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
              <p className="text-sm text-slate-600 mt-2">Total Points: {assignment.points}</p>
            </div>

            {/* Submitted By Info */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Submitted By
              </label>
              <div className="px-4 py-2 rounded-lg bg-slate-50 border-2 border-slate-200 text-slate-900 font-semibold">
                {gradeData.submittedBy}
              </div>
            </div>

            {/* Grade Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Grade (out of {assignment.points}) *
                </label>
                <Input
                  type="number"
                  value={gradeData.grade}
                  onChange={(e) => setGradeData(prev => ({
                    ...prev,
                    grade: parseInt(e.target.value) || 0
                  }))}
                  min="0"
                  max={assignment.points}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Grade Percentage
                </label>
                <div className="px-4 py-2 rounded-lg bg-slate-50 border-2 border-slate-200 text-slate-900 font-semibold">
                  {assignment.points > 0 ? ((gradeData.grade / assignment.points) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {/* Grade Visual */}
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
                style={{
                  width: assignment.points > 0 ? `${(gradeData.grade / assignment.points) * 100}%` : '0%'
                }}
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Feedback *
              </label>
              <textarea
                value={gradeData.feedback}
                onChange={(e) => setGradeData(prev => ({
                  ...prev,
                  feedback: e.target.value
                }))}
                placeholder="Provide constructive feedback for the student..."
                rows="4"
                required
                className="w-full px-4 py-2 rounded-lg bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <Icon name="Info" size={14} className="inline mr-2" />
                The grade and feedback will be sent to the student after submission.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 flex gap-3 justify-end sticky bottom-0 bg-white">
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
              Submit Grade
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradeSubmissionModal;
