import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ManualEntryModal = ({ isOpen, onClose, onSubmit, currentClass }) => {
  const [qrCode, setQrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!qrCode?.trim()) {
      setError('Please enter a valid QR code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate QR code validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation logic
      if (qrCode?.length < 8) {
        throw new Error('Invalid QR code format');
      }

      const mockQRData = {
        classId: currentClass?.id || 'CS101-2024',
        timestamp: Date.now(),
        location: 'Manual Entry',
        sessionId: qrCode,
        manualEntry: true
      };

      onSubmit(mockQRData);
      setQrCode('');
      onClose();
    } catch (err) {
      setError(err?.message || 'Invalid QR code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQrCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-card rounded-lg shadow-modal border border-border w-full max-w-md"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Icon name="Keyboard" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Manual Entry</h2>
                <p className="text-sm text-muted-foreground">Enter QR code manually</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <Input
                label="QR Code"
                type="text"
                placeholder="Enter the QR code from your class"
                value={qrCode}
                onChange={(e) => setQrCode(e?.target?.value)}
                error={error}
                required
                description="Type or paste the QR code shown by your instructor"
              />
            </div>

            {/* Class Info Reminder */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Current Class
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentClass?.subject || 'Computer Science Fundamentals'} • {currentClass?.code || 'CS101'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Make sure the QR code matches this class
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    Important Notes
                  </p>
                  <ul className="text-xs text-white space-y-1">
                    <li>• Only use QR codes provided by your instructor</li>
                    <li>• Each code can only be used once per student</li>
                    <li>• Manual entry is tracked for security purposes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isSubmitting}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Mark Attendance
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManualEntryModal;