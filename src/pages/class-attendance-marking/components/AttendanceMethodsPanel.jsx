import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { upsertAttendanceSession } from '../../../utils/attendanceSessionStore';

const to24Hour = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const amPmMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    const hours12 = parseInt(amPmMatch[1], 10);
    const minutes = parseInt(amPmMatch[2], 10);
    const meridiem = amPmMatch[3].toUpperCase();

    const hours24 = (hours12 % 12) + (meridiem === 'PM' ? 12 : 0);
    return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const twentyFourHourMatch = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    return `${String(parseInt(twentyFourHourMatch[1], 10)).padStart(2, '0')}:${twentyFourHourMatch[2]}`;
  }

  return '';
};

const getClassWindowFromRange = (timeRange) => {
  const [startRaw = '', endRaw = ''] = String(timeRange || '').split('-').map((part) => part.trim());
  return {
    classStartTime: to24Hour(startRaw),
    classEndTime: to24Hour(endRaw),
  };
};

const AttendanceMethodsPanel = ({ 
  qrCodeVisible, 
  onCloseQR, 
  biometricActive, 
  faceRecognitionActive,
  onBulkMarkPresent,
  onBulkMarkAbsent,
  selectedStudents,
  classInfo,
  recentActivity = []
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
    }, 10000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [qrCodeVisible]);

  const qrPayload = useMemo(() => {
    const sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
    const expiresInSeconds = 10;
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    const classWindow = getClassWindowFromRange(classInfo?.time);

    const payload = {
      classId: classInfo?.id || 'CLASS-12345',
      className: classInfo?.subject || 'Unknown Class',
      timestamp: Date.now(),
      location: classInfo?.location || 'Room A-101',
      sessionId,
      faculty: classInfo?.faculty || 'Faculty Name',
      classStartTime: classWindow.classStartTime,
      classEndTime: classWindow.classEndTime,
      expiresIn: expiresInSeconds,
      expiresAt
    };

    const baseURL = networkURL || `${window.location.protocol}//${window.location.host}`;
    const url = new URL('/mark-attendance', baseURL);
    url.searchParams.set('classId', payload.classId);
    url.searchParams.set('className', payload.className);
    url.searchParams.set('sessionId', payload.sessionId);
    url.searchParams.set('faculty', payload.faculty);
    url.searchParams.set('location', payload.location);
    url.searchParams.set('expiresAt', String(payload.expiresAt));
    if (payload.classStartTime) {
      url.searchParams.set('classStartTime', payload.classStartTime);
    }
    if (payload.classEndTime) {
      url.searchParams.set('classEndTime', payload.classEndTime);
    }

    return {
      ...payload,
      url: url.toString(),
    };
  }, [classInfo, qrRefreshKey, networkURL]);

  useEffect(() => {
    if (!qrCodeVisible || !qrPayload?.sessionId) return;

    upsertAttendanceSession({
      sessionId: qrPayload.sessionId,
      classId: qrPayload.classId,
      className: qrPayload.className,
      faculty: qrPayload.faculty,
      location: qrPayload.location,
      classStartTime: qrPayload.classStartTime,
      classEndTime: qrPayload.classEndTime,
      startedAt: Date.now(),
      expiresAt: qrPayload.expiresAt,
      qrURL: qrPayload.url,
    });
  }, [qrCodeVisible, qrPayload]);

  const qrCodeData = useMemo(() => {
    return qrPayload?.url || '';
  }, [qrPayload]);

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

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {qrCodeVisible && (
            <Button size="sm" variant="destructive" onClick={onCloseQR}>
              Stop QR
            </Button>
          )}

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
              <p className="text-[11px] mt-2 text-muted-foreground break-all max-w-[220px] mx-auto">
                {qrPayload?.url}
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="text-muted-foreground">
                <span className="text-foreground font-medium">{activity.studentName}</span>{' '}
                marked present via {activity.methodLabel}{' '}
                <span className="text-xs">({activity.timeLabel})</span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No attendance activity yet for this class.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AttendanceMethodsPanel;