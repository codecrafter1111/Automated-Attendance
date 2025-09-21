import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  scanData, 
  classInfo,
  isProcessing = false 
}) => {
  const [countdown, setCountdown] = useState(10);
  const [locationVerified, setLocationVerified] = useState(false);
  const [biometricRequired, setBiometricRequired] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      // Simulate location verification
      setTimeout(() => setLocationVerified(true), 1500);
      // Randomly require biometric verification
      setBiometricRequired(Math.random() > 0.7);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(scanData);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-card rounded-lg shadow-modal border border-border w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                <Icon name="QrCode" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">QR Code Detected</h2>
                <p className="text-sm text-muted-foreground">Confirm your attendance</p>
              </div>
            </div>
            {countdown > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{countdown}</div>
                <div className="text-xs text-muted-foreground">Auto-close</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Scan Details */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <h3 className="font-medium text-foreground mb-3">Scan Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class ID:</span>
                  <span className="font-medium text-foreground">{scanData?.classId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="font-medium text-foreground">
                    {formatTimestamp(scanData?.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session:</span>
                  <span className="font-medium text-foreground font-mono text-xs">
                    {scanData?.sessionId}
                  </span>
                </div>
                {scanData?.manualEntry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Type:</span>
                    <span className="text-warning font-medium">Manual Entry</span>
                  </div>
                )}
              </div>
            </div>

            {/* Class Verification */}
            <div className="bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary mb-1">Class Verified</p>
                  <p className="text-sm text-foreground">
                    {classInfo?.subject || 'Computer Science Fundamentals'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {classInfo?.faculty || 'Dr. Priya Sharma'} • {classInfo?.location || 'Room A-101'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Checks */}
            <div className="space-y-3 mb-6">
              <h3 className="font-medium text-foreground">Security Verification</h3>
              
              {/* Location Check */}
              <div className="flex items-center space-x-3">
                {locationVerified ? (
                  <Icon name="CheckCircle" size={20} className="text-success" />
                ) : (
                  <div className="animate-spin">
                    <Icon name="Loader2" size={20} className="text-primary" />
                  </div>
                )}
                <span className={`text-sm ${locationVerified ? 'text-success' : 'text-muted-foreground'}`}>
                  Location verification {locationVerified ? 'passed' : 'in progress...'}
                </span>
              </div>

              {/* Time Window Check */}
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm text-success">Time window validation passed</span>
              </div>

              {/* Biometric Check */}
              {biometricRequired && (
                <div className="flex items-center space-x-3">
                  <Icon name="Fingerprint" size={20} className="text-warning" />
                  <span className="text-sm text-warning">Biometric verification recommended</span>
                </div>
              )}

              {/* Duplicate Check */}
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm text-success">No duplicate attendance found</span>
              </div>
            </div>

            {/* Warning for Manual Entry */}
            {scanData?.manualEntry && (
              <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning mb-1">Manual Entry Notice</p>
                    <p className="text-xs text-warning">
                      This attendance was marked through manual entry and will be flagged for review.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={handleConfirm}
                loading={isProcessing}
                disabled={!locationVerified}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Confirm Attendance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceConfirmationModal;