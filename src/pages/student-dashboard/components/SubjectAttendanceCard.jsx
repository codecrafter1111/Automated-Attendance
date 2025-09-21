import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectAttendanceCard = ({ subjects }) => {
  const navigate = useNavigate();

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-error';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 85) return 'bg-success';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-error';
  };

  const handleViewHistory = () => {
    navigate('/student-attendance-history');
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Subject-wise Attendance</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewHistory}
          iconName="ExternalLink"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {subjects?.map((subject) => (
          <div key={subject?.id} className="border border-border rounded-lg p-4 hover:shadow-card transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{subject?.name}</h4>
                <p className="text-sm text-muted-foreground">{subject?.faculty}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getAttendanceColor(subject?.attendancePercentage)}`}>
                  {subject?.attendancePercentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {subject?.present}/{subject?.totalClasses} classes
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(subject?.attendancePercentage)}`}
                  style={{ width: `${subject?.attendancePercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-muted-foreground">Present: {subject?.present}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-error rounded-full" />
                  <span className="text-muted-foreground">Absent: {subject?.absent}</span>
                </div>
              </div>
              
              {subject?.attendancePercentage < 75 && (
                <div className="flex items-center space-x-1 text-error">
                  <Icon name="AlertTriangle" size={14} />
                  <span className="text-xs font-medium">Low Attendance</span>
                </div>
              )}
            </div>

            {subject?.nextClass && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>Next class: {subject?.nextClass?.date} at {subject?.nextClass?.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Icon name="MapPin" size={14} />
                    <span>{subject?.nextClass?.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectAttendanceCard;