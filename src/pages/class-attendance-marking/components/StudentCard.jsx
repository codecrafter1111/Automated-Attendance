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
    <div className={`bg-card rounded-lg shadow-card border transition-smooth ${
      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    } ${showProxyAlert ? 'ring-2 ring-warning/50' : ''}`}>
      {/* Proxy Alert Banner */}
      {showProxyAlert && (
        <div className="bg-warning text-warning-foreground px-4 py-2 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">Proxy Attendance Detected</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVerifyProxy(student?.id)}
            iconName="Eye"
            iconSize={14}
          >
            Verify
          </Button>
        </div>
      )}
      <div className="p-4">
        {/* Header with selection and status */}
        <div className="flex items-center justify-between mb-3">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(student?.id)}
          />
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student?.status)}`}>
              <Icon name={getStatusIcon(student?.status)} size={12} className="inline mr-1" />
              {student?.status?.charAt(0)?.toUpperCase() + student?.status?.slice(1)}
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
            {student?.timestamp && (
              <p className="text-xs text-muted-foreground">
                Marked: {new Date(student.timestamp)?.toLocaleTimeString()}
              </p>
            )}
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