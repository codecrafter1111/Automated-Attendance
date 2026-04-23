import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CameraScanner from './components/CameraScanner';
import ClassInfoHeader from './components/ClassInfoHeader';
import ManualEntryModal from './components/ManualEntryModal';
import AttendanceConfirmationModal from './components/AttendanceConfirmationModal';
import AttendanceSuccessModal from './components/AttendanceSuccessModal';
import ScanningControls from './components/ScanningControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('initializing');
  const [scanAttempts, setScanAttempts] = useState(0);
  
  // Modal states
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Data states
  const [scannedData, setScannedData] = useState(null);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const expectedClassId = searchParams.get('expectedClassId') || '';
  const expectedSubject = searchParams.get('expectedSubject') || '';
  const expectedFaculty = searchParams.get('expectedFaculty') || '';
  const expectedLocation = searchParams.get('expectedLocation') || '';
  const expectedStartTime = searchParams.get('expectedStartTime') || '';
  const expectedEndTime = searchParams.get('expectedEndTime') || '';
  const expectedCode = searchParams.get('expectedCode') || '';

  const currentClass = {
    id: expectedClassId || 'CS101-2024',
    subject: expectedSubject || 'Computer Science Fundamentals',
    code: expectedCode || 'CS101',
    faculty: expectedFaculty || 'Dr. Priya Sharma',
    location: expectedLocation || 'Room A-101, Block A',
    startTime: expectedStartTime || '09:00',
    endTime: expectedEndTime || '10:30'
  };

  const attendanceWindow = {
    start: currentClass.startTime,
    end: currentClass.endTime,
  };

  const isWithinAttendanceWindow = () => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    const [startHours, startMinutes] = String(attendanceWindow.start || '00:00').split(':');
    const [endHours, endMinutes] = String(attendanceWindow.end || '23:59').split(':');

    start.setHours(parseInt(startHours, 10) || 0, parseInt(startMinutes, 10) || 0, 0, 0);
    end.setHours(parseInt(endHours, 10) || 23, parseInt(endMinutes, 10) || 59, 0, 0);

    return now >= start && now <= end;
  };

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // If not logged in, redirect to login but preserve the QR parameters
      const classId = searchParams.get('classId');
      const sessionId = searchParams.get('sessionId');
      if (classId && sessionId) {
        // Encode redirect with proper URL encoding
        const redirectURL = `/qr-code-scanner?classId=${encodeURIComponent(classId)}&sessionId=${encodeURIComponent(sessionId)}`;
        navigate(`/login?redirect=${encodeURIComponent(redirectURL)}`);
      } else {
        navigate('/login');
      }
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Redirect non-students
    if (parsedUser?.role !== 'student') {
      navigate('/faculty-dashboard');
      return;
    }

    // Auto-process scanned data if URL parameters exist
    const classId = searchParams.get('classId');
    const sessionId = searchParams.get('sessionId');
    
    if (classId && sessionId) {
      console.log('✓ Auto-processing QR data:', { classId, sessionId });
      const qrData = {
        classId,
        sessionId,
        timestamp: Date.now(),
        location: 'QR-Scanned'
      };
      handleScanSuccess(qrData);
    }
  }, [navigate, searchParams]);

  const handleScanSuccess = (qrData) => {
    console.log('QR Code Scanned:', qrData);

    if (!isWithinAttendanceWindow()) {
      alert(`Attendance is allowed only during ${attendanceWindow.start} - ${attendanceWindow.end} for this class.`);
      return;
    }

    if (qrData?.redirectPath) {
      navigate(qrData.redirectPath);
      return;
    }

    setScannedData(qrData);
    setShowConfirmation(true);
    setIsScanning(false);
    setScanAttempts(0);
  };

  const handleScanError = (error) => {
    console.error('Scan error:', error);
    // Show user-friendly error notification
    if (error?.includes('permission')) {
      // Could integrate with a toast notification system here
      alert('Camera permission required. Please enable camera access and try again.');
    } else {
      alert('Scanner error: ' + error);
    }
  };

  const handleScanAttemptsUpdate = (attempts) => {
    setScanAttempts(attempts);
  };

  const handleStartScanning = () => {
    console.log('Start scanning clicked. Camera status:', cameraStatus);
    if (cameraStatus === 'ready') {
      setIsScanning(true);
      setScanAttempts(0);
    } else {
      alert('Camera not ready. Please wait for camera initialization or check permissions.');
    }
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    setScanAttempts(0);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleRetryCamera = () => {
    setCameraStatus('initializing');
  };

  const handleCameraStatusChange = (status) => {
    setCameraStatus(status);
  };

  const handleConfirmAttendance = async (scanData) => {
    if (!isWithinAttendanceWindow()) {
      alert(`Attendance window is closed. Allowed time: ${attendanceWindow.start} - ${attendanceWindow.end}.`);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate attendance marking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const attendanceData = {
        id: 'att_' + Math.random()?.toString(36)?.substr(2, 9),
        studentId: user?.id || 'STU001',
        classId: scanData?.classId,
        timestamp: scanData?.timestamp,
        status: 'present',
        method: scanData?.manualEntry ? 'manual' : 'qr_scan',
        location: scanData?.location,
        sessionId: scanData?.sessionId
      };

      setAttendanceResult(attendanceData);
      setShowConfirmation(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Attendance marking failed:', error);
      // Could show error modal here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setScannedData(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setAttendanceResult(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <Icon name="Loader2" size={32} className="text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      
      <main className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Class Information Header */}
          <ClassInfoHeader 
            classInfo={currentClass}
            attendanceWindow={attendanceWindow}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera Scanner */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Icon name="Camera" size={20} color="white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">QR Code Scanner</h2>
                      <p className="text-sm text-muted-foreground">
                        Scan the QR code displayed by your instructor
                      </p>
                    </div>
                  </div>
                  
                  {/* Camera Status Indicator */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      cameraStatus === 'ready' ? 'bg-success animate-pulse' :
                      cameraStatus === 'permission_denied' || cameraStatus === 'error' ? 'bg-error' :
                      cameraStatus === 'requesting'|| cameraStatus === 'initializing' ? 'bg-warning animate-pulse' : 'bg-muted'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      cameraStatus === 'ready' ? 'text-success' :
                      cameraStatus === 'permission_denied' || cameraStatus === 'error' ? 'text-error' :
                      cameraStatus === 'requesting'|| cameraStatus === 'initializing' ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {cameraStatus === 'ready' ? 'Ready' :
                       cameraStatus === 'permission_denied' ? 'Permission Denied' :
                       cameraStatus === 'error' ? 'Error' :
                       cameraStatus === 'requesting' ? 'Requesting Access' :
                       cameraStatus === 'initializing'? 'Initializing' : 'Offline'}
                    </span>
                  </div>
                </div>

                <CameraScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                  onCameraStatusChange={handleCameraStatusChange}
                  onUseManualEntry={handleManualEntry}
                  onScanAttemptsUpdate={handleScanAttemptsUpdate}
                  isScanning={isScanning}
                  currentClass={currentClass}
                />
              </div>
            </div>

            {/* Controls and Instructions */}
            <div className="space-y-6">
              {/* Scanning Controls */}
              <div className="bg-card rounded-lg p-6 shadow-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Controls</h3>
                <ScanningControls
                  isScanning={isScanning}
                  onStartScan={handleStartScanning}
                  onStopScan={handleStopScanning}
                  onManualEntry={handleManualEntry}
                  onRetryCamera={handleRetryCamera}
                  cameraStatus={cameraStatus}
                  scanAttempts={scanAttempts}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-lg p-6 shadow-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/student-dashboard')}
                    iconName="Home"
                    iconPosition="left"
                  >
                    Back to Dashboard
                  </Button>
                  
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate('/student-attendance-history')}
                    iconName="History"
                    iconPosition="left"
                  >
                    View History
                  </Button>
                </div>
              </div>

              {/* Camera Troubleshooting */}
              {(cameraStatus === 'permission_denied' || cameraStatus === 'error') && (
                <div className="bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error mb-2">
                        Camera Issues
                      </p>
                      <div className="text-xs text-error space-y-1">
                        <p>• Enable camera permissions in browser settings</p>
                        <p>• Refresh the page after enabling permissions</p>
                        <p>• Close other apps that might be using the camera</p>
                        <p>• Try using manual entry if camera fails</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              {/* <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={20} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning mb-1">
                      Security Notice
                    </p>
                    <p className="text-xs text-warning">
                      Your location and device information are verified to prevent proxy attendance. 
                      All scans are logged for security purposes.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ManualEntryModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSubmit={handleScanSuccess}
        currentClass={currentClass}
      />

      <AttendanceConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAttendance}
        scanData={scannedData}
        classInfo={currentClass}
        isProcessing={isProcessing}
      />

      <AttendanceSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        attendanceData={attendanceResult}
        classInfo={currentClass}
        user={user}
      />
    </div>
  );
};

export default QRCodeScanner;