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
  classInfo
}) => {
  const [networkURL, setNetworkURL] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);

  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setIsLocalhost(true);
      const suggestedURL = `http://172.20.10.5${port ? ':' + port : ''}`;
      setNetworkURL(suggestedURL);
    } else {
      setIsLocalhost(false);
      setNetworkURL(`${protocol}//${hostname}${port ? ':' + port : ''}`);
    }
  }, []);

  useEffect(() => {
    if (!qrCodeVisible) {
      setQrRefreshKey(0);
      setTimeRemaining(10);
      return;
    }

    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    const refreshInterval = setInterval(() => {
      setQrRefreshKey(prev => prev + 1);
      setTimeRemaining(10);
    }, 30000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [qrCodeVisible]);

  const qrCodeData = useMemo(() => {
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);

    return JSON.stringify({
      classId: classInfo?.id || 'CLASS-12345',
      className: classInfo?.subject || 'Unknown Class',
      timestamp: Date.now(),
      location: classInfo?.location || 'Room A-101',
      sessionId,
      faculty: classInfo?.faculty || 'Faculty Name',
      expiresIn: 10
    });
  }, [classInfo, qrRefreshKey]);

  if (!qrCodeVisible && !biometricActive && !faceRecognitionActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-card to-card/50 rounded-lg shadow-card border border-border p-6 mb-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Icon name="Zap" size={24} />
          <span>Active Attendance Methods</span>
        </h3>

        {selectedStudents?.length > 0 && (
          <div className="flex space-x-2">
            <Button size="sm" onClick={onBulkMarkPresent}>
              Present ({selectedStudents.length})
            </Button>
            <Button size="sm" onClick={onBulkMarkAbsent}>
              Absent ({selectedStudents.length})
            </Button>
          </div>
        )}
      </div>

      {/* LOCALHOST WARNING */}
      {isLocalhost && (
        <div className="bg-red-100 border border-red-400 p-4 rounded mb-4">
          <p className="text-sm">
            ⚠️ You are using <b>localhost</b>. Use this instead:
          </p>
          <p className="font-mono text-blue-600">{networkURL}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {/* QR CODE */}
        {qrCodeVisible && (
          <div className="text-center border p-4 rounded-lg">
            <h4 className="font-bold mb-3">QR Code</h4>

            <div className="inline-block bg-white p-3 rounded relative">
              <QRCodeSVG value={qrCodeData} size={128} />

              <div className="absolute top-1 -right-10 bg-black text-white text-xs px-2 py-1 rounded">
                {timeRemaining}s
              </div>
            </div>

            <div className="mt-1">
              <div className="bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${(timeRemaining / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs mt-1">
                Refreshing in {timeRemaining}s
              </p>
            </div>
          </div>
        )}

        {/* BIOMETRIC */}
        {biometricActive && (
          <div className="text-center border p-4 rounded-lg">
            <Icon name="Fingerprint" size={40} />
            <h4 className="font-bold mt-2">Biometric</h4>
            <p className="text-sm">Scanner Active</p>
          </div>
        )}

        {/* FACE */}
        {faceRecognitionActive && (
          <div className="text-center border p-4 rounded-lg">
            <Icon name="Camera" size={40} />
            <h4 className="font-bold mt-2">Face Recognition</h4>
            <p className="text-sm">Camera Active</p>
          </div>
        )}
      </div>

      {/* ACTIVITY */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-bold mb-2">Recent Activity</h4>

        <div className="space-y-2 text-sm">
          <div>Rahul Sharma marked present via QR</div>
          <div>Priya Patel verified via face</div>
          <div>Amit Kumar scanned fingerprint</div>
        </div>
      </div>

    </div>
  );
};

export default AttendanceMethodsPanel;