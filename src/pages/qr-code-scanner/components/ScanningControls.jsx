import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanningControls = ({ 
  isScanning, 
  onStartScan, 
  onStopScan, 
  onManualEntry, 
  onRetryCamera,
  cameraStatus,
  scanAttempts = 0 
}) => {
  const getScanButtonText = () => {
    if (isScanning) return 'Stop Scanning';
    if (cameraStatus === 'error') return 'Retry Camera';
    return 'Start Scanning';
  };

  const getScanButtonIcon = () => {
    if (isScanning) return 'Square';
    if (cameraStatus === 'error') return 'RefreshCw';
    return 'Play';
  };

  const handleScanToggle = () => {
    if (cameraStatus === 'error') {
      onRetryCamera();
    } else if (isScanning) {
      onStopScan();
    } else {
      onStartScan();
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Controls */}
      <div className="flex flex-col sm:flex-col gap-3">
        <Button
          variant={isScanning ? "destructive" : "default"}
          size="lg"
          fullWidth
          onClick={handleScanToggle}
          disabled={cameraStatus === 'initializing' || cameraStatus === 'requesting'}
          iconName={getScanButtonIcon()}
          iconPosition="left"
        >
          {getScanButtonText()}
        </Button>
  
        <Button
          variant="outline"
          size="lg"
          onClick={onManualEntry}
          iconName="Keyboard"
          iconPosition="left"
          className="sm:w-auto"
        >
          Manual Entry
        </Button>
      </div>

      {/* Scanning Status */}
      {isScanning && (
        <div className="bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <Icon name="Scan" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-primary">Scanning Active</p>
              <p className="text-sm text-muted-foreground">
                Position QR code within the frame
                {scanAttempts > 0 && ` • ${scanAttempts} attempts`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Camera Status */}
      {cameraStatus === 'error' && (
        <div className="bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="CameraOff" size={20} className="text-error" />
            <div>
              <p className="font-medium text-error">Camera Unavailable</p>
              <p className="text-sm text-error">
                Please enable camera permissions or try manual entry
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-muted rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="HelpCircle" size={16} />
          <span>How to scan</span>
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">1.</span>
            <span>Click "Start Scanning" to activate the camera</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">2.</span>
            <span>Position the QR code within the scanning frame</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">3.</span>
            <span>Hold steady until the code is detected automatically</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">4.</span>
            <span>Use "Manual Entry" if camera scanning fails</span>
          </li>
        </ul>
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Lightbulb" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Lighting</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ensure good lighting for better QR code detection
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Smartphone" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Distance</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep 6-12 inches away from the QR code
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanningControls;