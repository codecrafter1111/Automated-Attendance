import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveAttendanceSession = ({ session, onEndSession, onMarkStudent }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (session) {
      const startTime = new Date(session.startTime);
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-foreground">Live Attendance Session</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{session?.className}</h4>
            <p className="text-sm text-muted-foreground">{session?.room} • {session?.time}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-success">
              {session?.presentCount}/{session?.totalStudents}
            </div>
            <div className="text-xs text-muted-foreground">Students Present</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attendance Progress</span>
            <span className="font-medium text-foreground">
              {Math.round((session?.presentCount / session?.totalStudents) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${(session?.presentCount / session?.totalStudents) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/qr-code-display?session=${session?.id}`, '_blank')}
              iconName="QrCode"
              iconPosition="left"
              iconSize={16}
            >
              Show QR Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkStudent('manual')}
              iconName="UserPlus"
              iconPosition="left"
              iconSize={16}
            >
              Manual Mark
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onEndSession(session?.id)}
            iconName="Square"
            iconPosition="left"
            iconSize={16}
          >
            End Session
          </Button>
        </div>

        {session?.recentAttendance && session?.recentAttendance?.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h5 className="text-sm font-medium text-foreground mb-2">Recent Check-ins</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {session?.recentAttendance?.map((student, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{student?.name}</span>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>{student?.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAttendanceSession;