import React from 'react';
import Icon from '../../../components/AppIcon';

const ClassInfoHeader = ({ classInfo, attendanceWindow }) => {
  const formatTime = (timeString) => {
    return new Date(`2024-01-01 ${timeString}`)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeStatus = () => {
    if (!attendanceWindow) return { status: 'unknown', color: 'text-muted-foreground' };

    const now = new Date();
    const currentTime = now?.getHours() * 60 + now?.getMinutes();
    const startTime = parseInt(attendanceWindow?.start?.split(':')?.[0]) * 60 + parseInt(attendanceWindow?.start?.split(':')?.[1]);
    const endTime = parseInt(attendanceWindow?.end?.split(':')?.[0]) * 60 + parseInt(attendanceWindow?.end?.split(':')?.[1]);

    if (currentTime < startTime) {
      return { status: 'early', color: 'text-warning', message: 'Attendance not yet open' };
    } else if (currentTime > endTime) {
      return { status: 'late', color: 'text-error', message: 'Attendance window closed' };
    } else {
      const remaining = endTime - currentTime;
      const remainingHours = Math.floor(remaining / 60);
      const remainingMinutes = remaining % 60;
      let timeLeft = '';
      if (remainingHours > 0) {
        timeLeft = `${remainingHours}h ${remainingMinutes}m left`;
      } else {
        timeLeft = `${remainingMinutes}m left`;
      }
      return { status: 'active', color: 'text-success', message: timeLeft };
    }
  };

  const timeStatus = getTimeStatus();

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {classInfo?.subject || 'Computer Science Fundamentals'}
              </h1>
              <p className="text-muted-foreground">
                {classInfo?.code || 'CS101'} • Section {classInfo?.section || 'A'}
              </p>
            </div>
          </div>
        </div>

        {/* Time Status Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          timeStatus?.status === 'active' ?'bg-success bg-opacity-10 text-success' 
            : timeStatus?.status === 'early' ?'bg-warning bg-opacity-10 text-warning' :'bg-error bg-opacity-10 text-error'
        }`}>
          {timeStatus?.status === 'active' ? 'Active' : 
           timeStatus?.status === 'early' ? 'Upcoming' : 'Closed'}
        </div>
      </div>
      {/* Class Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="User" size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Faculty</p>
            <p className="font-medium text-foreground">
              {classInfo?.faculty || 'Dr. Priya Sharma'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium text-foreground">
              {classInfo?.location || 'Room A-101, Block A'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium text-foreground">
              {classInfo?.startTime && classInfo?.endTime 
                ? `${formatTime(classInfo?.startTime)} - ${formatTime(classInfo?.endTime)}`
                : '09:00 AM - 10:30 AM'
              }
            </p>
          </div>
        </div>
      </div>
      {/* Attendance Window Status */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon 
            name={timeStatus?.status === 'active' ? 'CheckCircle' : 
                  timeStatus?.status === 'early' ? 'Clock' : 'XCircle'} 
            size={20} 
            className={timeStatus?.color} 
          />
          <div>
            <p className="font-medium text-foreground">Attendance Status</p>
            <p className={`text-sm ${timeStatus?.color}`}>
              {timeStatus?.message || 'Status unknown'}
            </p>
          </div>
        </div>

        {attendanceWindow && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Window</p>
            <p className="font-medium text-foreground">
              {formatTime(attendanceWindow?.start)} - {formatTime(attendanceWindow?.end)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassInfoHeader;