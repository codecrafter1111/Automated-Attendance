import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayClassCard = ({ classData, onStartAttendance, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-warning';
      case 'ongoing': return 'text-success';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return 'Clock';
      case 'ongoing': return 'Play';
      case 'completed': return 'CheckCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-modal transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{classData?.name}</h3>
            <span className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(classData?.status)}`}>
              <Icon name={getStatusIcon(classData?.status)} size={14} />
              <span className="capitalize">{classData?.status}</span>
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>{classData?.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span>{classData?.room}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Users" size={16} />
              <span>{classData?.enrolledStudents} students enrolled</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{classData?.attendanceRate}%</div>
            <div className="text-xs text-muted-foreground">Avg. Attendance</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Subject Code: </span>
            <span className="font-medium text-foreground">{classData?.subjectCode}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(classData)}
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
          >
            View Details
          </Button>
          {classData?.status !== 'completed' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStartAttendance(classData)}
              iconName="QrCode"
              iconPosition="left"
              iconSize={16}
            >
              Start Attendance
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayClassCard;