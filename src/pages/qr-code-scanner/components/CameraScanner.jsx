import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraScanner = ({ onScanSuccess, onScanError, isScanning, currentClass, onCameraStatusChange, onUseManualEntry }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('ready');
  const [permissionState, setPermissionState] = useState('unknown');
  const [scanningActive, setScanningActive] = useState(false);
  const [detectedCode, setDetectedCode] = useState(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [errorDetails, setErrorDetails] = useState(null);

  // Update parent with camera status changes
  useEffect(() => {
    if (onCameraStatusChange) {
      onCameraStatusChange(cameraStatus);
    }
  }, [cameraStatus, onCameraStatusChange]);

  useEffect(() => {
    if (isScanning && cameraStatus === 'ready') {
      startScanning();
    } else {
      stopScanning();
    }
  }, [isScanning, cameraStatus]);

  const initializeCamera = async () => {
    try {
      setCameraStatus('requesting');
      setErrorDetails(null);

      // Check if getUserMedia is supported
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser. Please use Manual Entry.');
      }

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef?.current?.play()?.then(() => {
              setCameraStatus('ready');
              setPermissionState('granted');
            })?.catch((playError) => {
              console.error('Video play failed:', playError);
              setCameraStatus('error');
              setErrorDetails({
                title: 'Video Playback Failed',
                message: 'Unable to start video stream. Try using Manual Entry instead.',
                action: 'Retry'
              });
            });
        };

        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setCameraStatus('error');
          setErrorDetails({
            title: 'Video Stream Error',
            message: 'There was an error with the video stream.',
            action: 'Retry'
          });
        };
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      handleCameraError(error);
    }
  };

  const handleCameraError = (error) => {
    const errorMsg = error?.message || error?.toString() || 'Unknown error';
    console.error('Camera error:', errorMsg);
    
    if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
      setCameraStatus('permission_denied');
      setPermissionState('denied');
      setErrorDetails({
        title: 'Camera Permission Denied',
        message: 'Please allow camera access to use the scanner.',
        action: 'Grant Permission',
        instructions: [
          '1. Look for the camera icon in your browser\'s address bar',
          '2. Click it and select "Allow"',
          '3. Refresh the page'
        ]
      });
      onScanError?.('Camera permission denied');
    } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
      setCameraStatus('no_camera');
      setErrorDetails({
        title: 'No Camera Found',
        message: 'No camera device detected. Use Manual Entry instead.',
        action: 'Use Manual Entry'
      });
      onScanError?.('No camera found');
    } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
      setCameraStatus('camera_busy');
      setErrorDetails({
        title: 'Camera In Use',
        message: 'The camera is being used by another app. Close other apps and try again.',
        action: 'Retry'
      });
      onScanError?.('Camera is in use by another application');
    } else {
      setCameraStatus('error');
      setErrorDetails({
        title: 'Camera Error',
        message: 'Camera initialization failed. Try Manual Entry instead.',
        action: 'Use Manual Entry'
      });
      onScanError?.('Camera error: ' + errorMsg);
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      const tracks = streamRef?.current?.getTracks();
      tracks?.forEach(track => track?.stop());
      streamRef.current = null;
    }
    
    if (videoRef?.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraStatus('stopped');
  };

  const startScanning = () => {
    setScanningActive(true);
    setScanAttempts(0);
    
    // Try to initialize camera only once when scanning starts
    if (cameraStatus === 'ready' && !streamRef.current) {
      initializeCamera();
    }
    
    scanForQRCode();
  };

  const stopScanning = () => {
    setScanningActive(false);
    setDetectedCode(null);
  };

  const scanForQRCode = () => {
    if (!scanningActive || !videoRef?.current || cameraStatus !== 'ready') return;

    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !video || !context || !video.videoWidth) return;

    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0, canvas?.width, canvas?.height);

    // Simulate QR code detection
    const mockDetection = Math.random() > 0.85;
    
    if (mockDetection && scanAttempts > 5) {
      const mockQRData = {
        classId: currentClass?.id || 'CS101-2024',
        timestamp: Date.now(),
        location: 'Room-A101',
        sessionId: 'sess_' + Math.random()?.toString(36)?.substr(2, 9)
      };
      
      setDetectedCode(mockQRData);
      onScanSuccess?.(mockQRData);
      setScanningActive(false);
      
      // Haptic feedback on mobile
      if (navigator?.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setScanAttempts(prev => prev + 1);
      setTimeout(() => {
        if (scanningActive) {
          scanForQRCode();
        }
      }, 100);
    }
  };

  const retryCamera = () => {
    stopCamera();
    setErrorDetails(null);
    setCameraStatus('ready');
    setTimeout(() => {
      if (isScanning) {
        initializeCamera();
      }
    }, 500);
  };

  const renderCameraStatus = () => {
    switch (cameraStatus) {
      case 'initializing':
      case 'checking_permissions':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted rounded-lg p-8">
            <div className="animate-spin mb-4">
              <Icon name="Loader2" size={32} className="text-primary" />
            </div>
            <p className="text-foreground font-medium">Initializing camera...</p>
            <p className="text-muted-foreground text-sm mt-1">Setting up camera access</p>
          </div>
        );

      case 'requesting':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted rounded-lg p-8">
            <Icon name="Camera" size={48} className="text-primary mb-4" />
            <p className="text-foreground font-medium">Requesting camera access...</p>
            <p className="text-muted-foreground text-sm mt-1 text-center">
              Please allow camera access when prompted
            </p>
            <div className="mt-4 p-3 bg-info bg-opacity-10 rounded-lg border border-info border-opacity-20">
              <p className="text-info text-xs text-center">
                Look for the camera icon in your browser's address bar
              </p>
            </div>
          </div>
        );

      case 'permission_denied':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted rounded-lg p-8">
            <Icon name="CameraOff" size={48} className="text-error mb-4" />
            <p className="text-foreground font-medium mb-2">{errorDetails?.title}</p>
            <p className="text-muted-foreground text-sm text-center mb-4">
              {errorDetails?.message}
            </p>
            {errorDetails?.instructions && (
              <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded-lg border border-warning border-opacity-20 text-left w-full max-w-sm">
                {errorDetails?.instructions?.map((instruction, index) => (
                  <p key={index} className="text-warning text-xs mb-1">
                    {instruction}
                  </p>
                ))}
              </div>
            )}
            <div className="flex flex-col space-y-2 w-full max-w-sm">
              <Button variant="outline" onClick={retryCamera} iconName="RefreshCw" className="w-full">
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => onUseManualEntry?.()} iconName="Edit" className="w-full">
                Use Manual Entry Instead
              </Button>
            </div>
          </div>
        );

      case 'no_camera':
      case 'camera_busy':
      case 'unsupported':
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted rounded-lg p-8">
            <Icon 
              name={cameraStatus === 'no_camera' ? 'Camera' : 
                    cameraStatus === 'camera_busy' ? 'CameraOff' : 
                    cameraStatus === 'unsupported' ? 'AlertTriangle' : 'AlertCircle'} 
              size={48} 
              className="text-error mb-4" 
            />
            <p className="text-foreground font-medium mb-2">{errorDetails?.title}</p>
            <p className="text-muted-foreground text-sm text-center mb-6 max-w-sm">
              {errorDetails?.message}
            </p>
            <div className="flex flex-col space-y-2 w-full max-w-sm">
              <Button 
                variant="outline" 
                onClick={retryCamera} 
                iconName="RefreshCw"
                className="w-full"
              >
                {errorDetails?.action?.split(' ')[0] === 'Use' ? 'Use Manual Entry' : errorDetails?.action || 'Retry'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onUseManualEntry?.()} 
                iconName="Edit"
                className="w-full"
              >
                Use Manual Entry Instead
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (cameraStatus !== 'ready') {
    return (
      <div className="relative w-full h-80 md:h-96">
        {renderCameraStatus()}
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 md:h-96 bg-black rounded-lg overflow-hidden">
      {/* Video Stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Scanning Frame */}
        <div className="relative w-64 h-64 border-2 border-primary rounded-lg">
          {/* Corner Indicators */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

          {/* Scanning Animation */}
          {scanningActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-primary opacity-80 animate-pulse"></div>
            </div>
          )}

          {/* Detection Success */}
          {detectedCode && (
            <div className="absolute inset-0 bg-success bg-opacity-20 flex items-center justify-center rounded-lg">
              <Icon name="CheckCircle" size={48} className="text-success" />
            </div>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Connection Status */}
        <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Live</span>
        </div>

        {/* Scan Counter */}
        {scanningActive && (
          <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <span className="text-white text-sm">
              Scanning... {scanAttempts > 0 && `(${scanAttempts})`}
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black bg-opacity-70 rounded-lg p-4 text-center">
          <p className="text-white text-sm font-medium mb-1">
            Position QR code within the frame
          </p>
          <p className="text-gray-300 text-xs">
            Hold steady for automatic detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraScanner;