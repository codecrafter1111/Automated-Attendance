import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { enrollBiometric } from '../../../utils/biometricService';

const BiometricEnrollmentModal = ({ isOpen, onClose, onSuccess, userId, userName }) => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleStartEnrollment = async () => {
    setScanning(true);
    setStatus('scanning');
    setError(null);
    setMessage('Initializing biometric scanner...');

    try {
      const result = await enrollBiometric(userId, userName);
      setStatus('success');
      setMessage(`✓ Biometric enrollment successful for ${userName}`);
      setScanning(false);

      // Call success callback
      setTimeout(() => {
        onSuccess?.(result);
        setTimeout(() => {
          onClose?.();
          setScanning(false);
          setStatus('idle');
          setError(null);
          setMessage('');
        }, 1000);
      }, 1500);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Biometric enrollment failed. Please try again.');
      setScanning(false);
      console.error('Biometric enrollment error:', err);
    }
  };

  const handleReset = () => {
    setScanning(false);
    setStatus('idle');
    setError(null);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Enroll Biometric</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          {!scanning && status === 'idle' && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-center">
              <h3 className="font-bold text-foreground">{userName}</h3>
              <p className="text-sm text-muted-foreground">User ID: {userId}</p>
            </div>
          )}

          {/* Scanner Visual */}
          {scanning && status === 'scanning' && (
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 border-4 border-primary rounded-full flex items-center justify-center animate-pulse">
                  <Icon name="Fingerprint" size={48} className="text-primary" />
                </div>
              </div>
              <p className="text-foreground font-medium mb-2">Scanning...</p>
              <p className="text-sm text-muted-foreground">
                Place your finger on the biometric scanner
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Check" size={48} className="text-success-foreground" />
                </div>
              </div>
              <p className="text-foreground font-bold mb-2">Enrollment Successful!</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-error">Enrollment Failed</p>
                  <p className="text-sm text-error/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && status !== 'success' && status !== 'error' && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary">{message}</p>
            </div>
          )}

          {/* Instructions */}
          {status === 'idle' && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Enrollment Instructions:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Make sure your finger is clean and dry</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Place your finger on the biometric sensor</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Keep your finger still until scanning completes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Remove and repeat if prompted for multiple scans</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!scanning && status !== 'success' && (
              <>
                <Button
                  fullWidth
                  variant="default"
                  onClick={handleStartEnrollment}
                  iconName="Fingerprint"
                  iconPosition="left"
                >
                  Start Enrollment
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </>
            )}

            {status === 'success' && (
              <Button
                fullWidth
                variant="default"
                onClick={onClose}
              >
                Done
              </Button>
            )}

            {status === 'error' && (
              <>
                <Button
                  fullWidth
                  variant="default"
                  onClick={handleStartEnrollment}
                  iconName="RotateCw"
                  iconPosition="left"
                >
                  Try Again
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricEnrollmentModal;
