import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceSuccessModal = ({ 
  isOpen, 
  onClose, 
  attendanceData, 
  classInfo,
  user 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleGoToDashboard();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleGoToDashboard = () => {
    onClose();
    navigate(user?.role === 'student' ? '/student-dashboard' : '/faculty-dashboard');
  };

  const handleViewHistory = () => {
    onClose();
    navigate('/student-attendance-history');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-card rounded-lg shadow-modal border border-border w-full max-w-md">
          {/* Success Animation */}
          <div className="text-center p-8 border-b border-border">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Icon name="CheckCircle" size={40} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Attendance Marked!
            </h2>
            <p className="text-muted-foreground">
              Your attendance has been successfully recorded
            </p>
          </div>

          {/* Attendance Details */}
          <div className="p-6">
            <div className="bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subject:</span>
                  <span className="font-medium text-foreground">
                    {classInfo?.subject || 'Computer Science Fundamentals'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Faculty:</span>
                  <span className="font-medium text-foreground">
                    {classInfo?.faculty || 'Dr. Priya Sharma'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="font-medium text-foreground">
                    {formatTimestamp(attendanceData?.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="font-medium text-success">Present</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    What happens next?
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Your attendance is immediately recorded in the system</li>
                    <li>• Faculty will see your attendance status in real-time</li>
                    <li>• You can view your attendance history anytime</li>
                    <li>• Attendance reports will be updated automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                onClick={handleGoToDashboard}
                iconName="Home"
                iconPosition="left"
              >
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={handleViewHistory}
                iconName="History"
                iconPosition="left"
              >
                View Attendance History
              </Button>
            </div>

            {/* Auto-redirect Notice */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Automatically redirecting to dashboard in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSuccessModal;