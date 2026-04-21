import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceMethodsPanel = ({ 
  qrCodeVisible, 
  onCloseQR, 
  biometricActive, 
  faceRecognitionActive,
  onBulkMarkPresent,
  onBulkMarkAbsent,
  selectedStudents 
}) => {
  const [networkURL, setNetworkURL] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  useEffect(() => {
    // Detect if we're on localhost and store network URL
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    // Check if localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setIsLocalhost(true);
      console.warn('⚠️ QR Code Issue: You are accessing via localhost');
      console.warn('📱 To generate working QR codes for phones, you MUST access via network IP');
      console.warn('📍 Use: http://172.20.10.5:4028 (or your actual network IP)');
      // Try to show suggestion
      const suggestedURL = `http://172.20.10.5${port ? ':' + port : ''}`;
      setNetworkURL(suggestedURL);
    } else {
      setIsLocalhost(false);
      setNetworkURL(`${protocol}//${hostname}${port ? ':' + port : ''}`);
    }
  }, []);
  
  // Generate QR code with network IP (accessible from phone)
  const classId = 'CS101-' + Date.now();
  const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
  
  const baseURL = networkURL || `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
  const qrData = `${baseURL}/qr-code-scanner?classId=${classId}&sessionId=${sessionId}`;
  const [qrCode] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);

  // Debug: Show what URL is being encoded
  console.log('🔗 QR Code URL:', qrData);
  console.log('📱 Network URL:', baseURL);
  console.log('🚨 Localhost?', isLocalhost);

  if (!qrCodeVisible && !biometricActive && !faceRecognitionActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 rounded-lg shadow-card border border-border p-6 mb-6 hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center space-x-2">
          <Icon name="Zap" size={24} className="text-primary" />
          <span>Active Attendance Methods</span>
        </h3>
        <div className="flex items-center space-x-2">
          {selectedStudents?.length > 0 && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={onBulkMarkPresent}
                iconName="Check"
                iconPosition="left"
                className="shadow-button"
              >
                Mark Selected Present ({selectedStudents?.length})
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onBulkMarkAbsent}
                iconName="X"
                iconPosition="left"
                className="shadow-button"
              >
                Mark Selected Absent ({selectedStudents?.length})
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Localhost Warning */}
        {isLocalhost && (
          <div className="md:col-span-3 bg-error/10 border-2 border-error rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={24} className="text-error mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-error mb-2">⚠️ QR Code Issue Detected</h4>
                <p className="text-sm text-error mb-2">You are currently on <span className="font-mono font-bold">localhost</span>. QR codes won't work from phones!</p>
                <div className="bg-white bg-opacity-50 rounded p-3 mb-2">
                  <p className="text-xs font-medium text-foreground mb-1">✅ FIX: Access via your network IP instead:</p>
                  <p className="text-sm font-mono font-bold text-primary bg-gray-100 rounded px-2 py-1">
                    {networkURL}
                  </p>
                </div>
                <p className="text-xs text-error">
                  📱 Copy this URL to your browser, then generate QR codes from there
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* QR Code Section */}
        {qrCodeVisible && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 text-center border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-foreground flex items-center space-x-2">
                <Icon name="QrCode" size={20} className="text-primary" />
                <span>QR Code Scanner</span>
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseQR}
                iconName="X"
                iconSize={16}
              />
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 inline-block shadow-card hover:shadow-card-hover transition-shadow">
              <img 
                src={qrCode} 
                alt="Attendance QR Code" 
                className="w-32 h-32 mx-auto"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-left">
              <p className="text-xs font-mono text-blue-900 break-all">
                🔗 {qrData}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Students can scan this QR code to mark attendance
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-success font-semibold">
              <Icon name="Wifi" size={12} />
              <span>Live & Active</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Biometric Section */}
        {biometricActive && (
          <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-6 text-center border-2 border-success/20 hover:border-success/40 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Icon name="Fingerprint" size={40} color="white" />
              </div>
            </div>
            <h4 className="font-bold text-foreground mb-2 flex items-center justify-center space-x-2">
              <Icon name="Fingerprint" size={20} className="text-success" />
              <span>Biometric Scanner</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ready to scan fingerprints
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-success font-semibold">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Scanner Active</span>
            </div>
          </div>
        )}

        {/* Face Recognition Section */}
        {faceRecognitionActive && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 text-center border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Icon name="Camera" size={40} color="white" />
              </div>
            </div>
            <h4 className="font-bold text-foreground mb-2 flex items-center justify-center space-x-2">
              <Icon name="Camera" size={20} className="text-primary" />
              <span>Face Recognition</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Camera monitoring for faces
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-primary font-semibold">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Camera Active</span>
            </div>
          </div>
        )}
      </div>
      {/* Real-time Activity Feed */}
      <div className="mt-6 pt-6 border-t-2 border-border">
        <h4 className="font-bold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <span>Recent Activity</span>
        </h4>
        <div className="space-y-2 max-h-36 overflow-y-auto">
          <div className="flex items-center space-x-3 text-sm p-3 bg-success/5 rounded-lg border border-success/20 hover:border-success/40 transition-colors">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground flex-1">Rahul Sharma marked present via QR code</span>
            <span className="text-xs text-muted-foreground font-medium">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm p-3 bg-primary/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-muted-foreground flex-1">Priya Patel verified via face recognition</span>
            <span className="text-xs text-muted-foreground font-medium">5 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm p-3 bg-success/5 rounded-lg border border-success/20 hover:border-success/40 transition-colors">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground flex-1">Amit Kumar scanned fingerprint</span>
            <span className="text-xs text-muted-foreground font-medium">7 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMethodsPanel;