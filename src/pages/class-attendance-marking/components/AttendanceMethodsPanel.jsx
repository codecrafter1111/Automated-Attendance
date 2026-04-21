import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceMethodsPanel = ({ 
  qrCodeVisible, 
  onCloseQR, 
  biometricActive, 
  faceRecognitionActive,
  onBulkMarkPresent,
  onBulkMarkAbsent,
  selectedStudents,
  classInfo // Add classInfo prop to get actual class data
}) => {
  // State to force QR code regeneration
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Auto-refresh QR code every 30 seconds
  useEffect(() => {
    if (!qrCodeVisible) {
      setQrRefreshKey(0);
      setTimeRemaining(30);
      return;
    }

    // Reset timer when QR becomes visible
    setTimeRemaining(30);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 30; // Reset to 30 when it hits 0
        }
        return prev - 1;
      });
    }, 1000);

    // Refresh QR code every 30 seconds
    const refreshInterval = setInterval(() => {
      setQrRefreshKey(prev => prev + 1);
      setTimeRemaining(30);
      console.log('QR Code refreshed for security');
    }, 30000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [qrCodeVisible]);

  // Generate QR code data with proper structure
  const qrCodeData = useMemo(() => {
    const sessionId = 'sess_' + Math.random()?.toString(36)?.substr(2, 9);
    const timestamp = Date.now();
    
    // Create structured data that matches what scanner expects
    const data = {
      classId: classInfo?.id || 'CLASS-12345',
      className: classInfo?.subject || 'Unknown Class',
      timestamp: timestamp,
      location: classInfo?.location || 'Room A-101',
      sessionId: sessionId,
      faculty: classInfo?.faculty || 'Faculty Name',
      expiresIn: 30 // Expires in 30 seconds
    };
    
    // Return JSON string for QR code
    return JSON.stringify(data);
  }, [classInfo, qrRefreshKey]); // Re-generate when qrRefreshKey changes

  // Alternative: Use simple string format for backward compatibility
  // const qrCodeData = `AttendEase-Class-${classInfo?.id || '12345'}-Session-${Date.now()}`;

  if (!qrCodeVisible && !biometricActive && !faceRecognitionActive) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Active Attendance Methods</h3>
        <div className="flex items-center space-x-2">
          {selectedStudents?.length > 0 && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={onBulkMarkPresent}
                iconName="Check"
                iconPosition="left"
              >
                Mark Selected Present ({selectedStudents?.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkMarkAbsent}
                iconName="X"
                iconPosition="left"
              >
                Mark Selected Absent ({selectedStudents?.length})
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* QR Code Section */}
        {qrCodeVisible && (
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">QR Code Scanner</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseQR}
                iconName="X"
                iconSize={16}
              />
            </div>
            <div className="bg-white p-4 rounded-lg mb-3 inline-block relative">
              <QRCodeSVG 
                value={qrCodeData}
                size={128}
                level="H"
                includeMargin={true}
              />
              {/* Countdown overlay */}
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                {timeRemaining}s
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Students can scan this QR code to mark attendance
            </p>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-success h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Auto-refreshing in {timeRemaining} seconds
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-success">
              <Icon name="Wifi" size={12} />
              <span>Live & Active</span>
            </div>
          </div>
        )}

        {/* Biometric Section */}
        {biometricActive && (
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <Icon name="Fingerprint" size={32} color="white" />
              </div>
            </div>
            <h4 className="font-medium text-foreground mb-2">Biometric Scanner</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ready to scan fingerprints
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Scanner Active</span>
            </div>
          </div>
        )}

        {/* Face Recognition Section */}
        {faceRecognitionActive && (
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Camera" size={32} color="white" />
              </div>
            </div>
            <h4 className="font-medium text-foreground mb-2">Face Recognition</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Camera monitoring for faces
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Camera Active</span>
            </div>
          </div>
        )}
      </div>
      {/* Real-time Activity Feed */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Rahul Sharma marked present via QR code</span>
            <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Priya Patel verified via face recognition</span>
            <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Amit Kumar scanned fingerprint</span>
            <span className="text-xs text-muted-foreground ml-auto">7 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMethodsPanel;