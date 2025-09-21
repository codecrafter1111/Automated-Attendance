import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassHeader = ({ 
  classInfo, 
  attendanceStats, 
  onGenerateQR, 
  onToggleBiometric, 
  onToggleFaceRecognition,
  biometricActive,
  faceRecognitionActive,
  isOfflineMode 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'ended': return 'text-error';
      default: return 'text-warning';
    }
  };

  const getAttendancePercentage = () => {
    if (attendanceStats?.total === 0) return 0;
    return Math.round((attendanceStats?.present / attendanceStats?.total) * 100);
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
      {/* Class Information */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{classInfo?.subject}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              classInfo?.status === 'active' ?'bg-success text-success-foreground' :'bg-warning text-warning-foreground'
            }`}>
              {classInfo?.status === 'active' ? 'Live Session' : 'Scheduled'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>{classInfo?.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} />
              <span>{classInfo?.room}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>{classInfo?.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>{attendanceStats?.total} Students</span>
            </div>
          </div>
        </div>

        {/* Offline Mode Indicator */}
        {isOfflineMode && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-warning rounded-lg">
            <Icon name="WifiOff" size={16} className="text-warning-foreground" />
            <span className="text-sm font-medium text-warning-foreground">Offline Mode</span>
          </div>
        )}
      </div>
      {/* Attendance Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{attendanceStats?.present}</div>
          <div className="text-sm text-muted-foreground">Present</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error">{attendanceStats?.absent}</div>
          <div className="text-sm text-muted-foreground">Absent</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{attendanceStats?.late}</div>
          <div className="text-sm text-muted-foreground">Late</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{getAttendancePercentage()}%</div>
          <div className="text-sm text-muted-foreground">Attendance</div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={onGenerateQR}
          iconName="QrCode"
          iconPosition="left"
        >
          Generate QR Code
        </Button>
        
        <Button
          variant={biometricActive ? "success" : "outline"}
          onClick={onToggleBiometric}
          iconName="Fingerprint"
          iconPosition="left"
        >
          {biometricActive ? 'Biometric Active' : 'Enable Biometric'}
        </Button>
        
        <Button
          variant={faceRecognitionActive ? "success" : "outline"}
          onClick={onToggleFaceRecognition}
          iconName="Camera"
          iconPosition="left"
        >
          {faceRecognitionActive ? 'Face Recognition On' : 'Enable Face Recognition'}
        </Button>
      </div>
    </div>
  );
};

export default ClassHeader;