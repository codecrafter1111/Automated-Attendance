import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceOverviewCard = ({ attendanceStats }) => {
  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-error';
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return { text: 'Excellent', color: 'bg-success' };
    if (percentage >= 75) return { text: 'Good', color: 'bg-warning' };
    return { text: 'Low', color: 'bg-error' };
  };

  const status = getAttendanceStatus(attendanceStats?.percentage);

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Overall Attendance</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status?.color}`}>
          {status?.text}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="CheckCircle" size={24} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{attendanceStats?.present}</div>
          <div className="text-sm text-muted-foreground">Present</div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="XCircle" size={24} className="text-error" />
          </div>
          <div className="text-2xl font-bold text-foreground">{attendanceStats?.absent}</div>
          <div className="text-sm text-muted-foreground">Absent</div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Clock" size={24} className="text-warning" />
          </div>
          <div className="text-2xl font-bold text-foreground">{attendanceStats?.late}</div>
          <div className="text-sm text-muted-foreground">Late</div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Calendar" size={24} className="text-secondary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{attendanceStats?.totalClasses}</div>
          <div className="text-sm text-muted-foreground">Total Classes</div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Attendance Percentage</span>
          <span className={`text-sm font-medium ${getAttendanceColor(attendanceStats?.percentage)}`}>
            {attendanceStats?.percentage}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              attendanceStats?.percentage >= 85 ? 'bg-success' :
              attendanceStats?.percentage >= 75 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${attendanceStats?.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverviewCard;