import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/AppImage';

const StudentCard = ({ 
  student, 
  isSelected, 
  onSelect, 
  onStatusChange, 
  onVerifyProxy,
  onBiometricVerify,
  showProxyAlert 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'absent': return 'bg-error text-error-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'Check';
      case 'absent': return 'X';
      case 'late': return 'Clock';
      default: return 'Minus';
    }
  };

  const getVerificationIcon = (method) => {
    switch (method) {
      case 'qr': return 'QrCode';
      case 'biometric': return 'Fingerprint';
      case 'face': return 'Camera';
      case 'manual': return 'User';
      default: return 'Minus';
    }
  };

  return (
    <div className={`group bg-card rounded-lg border-2 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${
      isSelected ? 'border-primary shadow-card ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
    } ${showProxyAlert ? 'ring-2 ring-warning/50 border-warning/50' : 'overflow-hidden'}`}>
      {/* Proxy Alert Banner */}
      {showProxyAlert && (
        <div className="bg-gradient-to-r from-warning/20 to-warning/10 px-4 py-3 border-b-2 border-warning/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-bold text-warning">⚠️ Proxy Detected</span>
          </div>
          <Button
            variant="warning"
            size="sm"
            onClick={() => onVerifyProxy(student?.id)}
            iconName="Eye"
            iconSize={14}
            className="shadow-button"
          >
            Verify
          </Button>
        </div>
      )}
      <div className="p-4">
        {/* Header with selection and status */}
        <div className="flex items-center justify-between mb-4">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(student?.id)}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
              getStatusColor(student?.status) === 'bg-success text-success-foreground' ? 'bg-success/20 text-success' :
              getStatusColor(student?.status) === 'bg-error text-error-foreground' ? 'bg-error/20 text-error' :
              getStatusColor(student?.status) === 'bg-warning text-warning-foreground' ? 'bg-warning/20 text-warning' :
              'bg-muted/20 text-muted-foreground'
            }`}>
              <Icon name={getStatusIcon(student?.status)} size={14} />
              <span>{student?.status?.charAt(0)?.toUpperCase() + student?.status?.slice(1)}</span>
            </span>
          </div>
        </div>

        {/* Student Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Image
              src={student?.photo}
              alt={student?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {student?.verificationMethod && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon 
                  name={getVerificationIcon(student?.verificationMethod)} 
                  size={12} 
                  color="white" 
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">{student?.name}</h4>
            <p className="text-sm text-muted-foreground">Roll: {student?.rollNumber}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              {student?.timestamp && (
                <span className="text-muted-foreground">
                  Marked: {new Date(student.timestamp)?.toLocaleTimeString()}
                </span>
              )}
              {student?.status === 'present' && (
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">
                  Attendance recorded{student?.verificationMethod ? ` via ${student.verificationMethod}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={student?.status === 'present' ? 'success' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student?.id, 'present')}
            iconName="Check"
            iconSize={14}
          >
            Present
          </Button>
          
          <Button
            variant={student?.status === 'late' ? 'warning' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student?.id, 'late')}
            iconName="Clock"
            iconSize={14}
          >
            Late
          </Button>
          
          <Button
            variant={student?.status === 'absent' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student?.id, 'absent')}
            iconName="X"
            iconSize={14}
          >
            Absent
          </Button>
        </div>

        {/* Biometric Verification Button */}
        {onBiometricVerify && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onBiometricVerify(student?.id)}
            iconName="Fingerprint"
            iconSize={14}
            className="mt-2 hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            Verify Biometric
          </Button>
        )}

        {/* Additional Info */}
        {student?.notes && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{student?.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCard;