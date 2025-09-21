import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayClassesCard = ({ todayClasses }) => {
  const navigate = useNavigate();

  const getTimeStatus = (startTime) => {
    const now = new Date();
    const classTime = new Date();
    const [hours, minutes] = startTime?.split(':');
    classTime?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diffMinutes = (classTime - now) / (1000 * 60);
    
    if (diffMinutes > 30) return { status: 'upcoming', color: 'text-muted-foreground' };
    if (diffMinutes > 0) return { status: 'starting-soon', color: 'text-warning' };
    if (diffMinutes > -60) return { status: 'ongoing', color: 'text-success' };
    return { status: 'completed', color: 'text-muted-foreground' };
  };

  const handleQRScan = () => {
    navigate('/qr-code-scanner');
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Today's Classes</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>{new Date()?.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'short' 
          })}</span>
        </div>
      </div>
      {todayClasses?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No classes scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayClasses?.map((classItem) => {
            const timeStatus = getTimeStatus(classItem?.startTime);
            
            return (
              <div key={classItem?.id} className="border border-border rounded-lg p-4 hover:shadow-card transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{classItem?.subject}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        timeStatus?.status === 'ongoing' ? 'bg-success text-success-foreground' :
                        timeStatus?.status === 'starting-soon' ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {timeStatus?.status === 'ongoing' ? 'Live' :
                         timeStatus?.status === 'starting-soon' ? 'Starting Soon' :
                         timeStatus?.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} />
                        <span>{classItem?.startTime} - {classItem?.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="MapPin" size={14} />
                        <span>{classItem?.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={14} />
                        <span>{classItem?.faculty}</span>
                      </div>
                    </div>

                    {classItem?.attendanceMarked ? (
                      <div className="flex items-center space-x-2 text-success">
                        <Icon name="CheckCircle" size={16} />
                        <span className="text-sm font-medium">Attendance Marked</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleQRScan}
                          iconName="QrCode"
                          iconPosition="left"
                          disabled={timeStatus?.status === 'completed'}
                        >
                          Scan QR
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Fingerprint"
                          iconPosition="left"
                          disabled={timeStatus?.status === 'completed'}
                        >
                          Biometric
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayClassesCard;