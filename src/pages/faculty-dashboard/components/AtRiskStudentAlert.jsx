import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AtRiskStudentAlert = ({ students, onViewStudent, onSendAlert }) => {
  const getRiskLevel = (percentage) => {
    if (percentage < 50) return { level: 'high', color: 'text-error', bgColor: 'bg-error/10' };
    if (percentage < 70) return { level: 'medium', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { level: 'low', color: 'text-success', bgColor: 'bg-success/10' };
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      default: return 'Info';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">At-Risk Students</h3>
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <span className="text-sm font-medium text-warning">{students?.length} alerts</span>
        </div>
      </div>
      <div className="space-y-3 max-h-200 overflow-y-auto">
        {students?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-2" />
            <p className="text-muted-foreground">No at-risk students found</p>
            <p className="text-sm text-muted-foreground">All students are maintaining good attendance</p>
          </div>
        ) : (
          students?.map((student) => {
            const risk = getRiskLevel(student?.attendancePercentage);
            return (
              <div
                key={student?.id}
                className={`p-4 rounded-lg border ${risk?.bgColor} border-border hover:shadow-sm transition-smooth`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{student?.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Roll: {student?.rollNumber}</span>
                        <span>•</span>
                        <span>{student?.class}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${risk?.color}`}>
                        <Icon name={getRiskIcon(risk?.level)} size={16} />
                        <span className="font-semibold">{student?.attendancePercentage}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student?.classesAttended}/{student?.totalClasses} classes
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewStudent(student)}
                        iconName="Eye"
                        iconSize={16}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendAlert(student)}
                        iconName="Mail"
                        iconSize={16}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Last attended: {student?.lastAttended}
                  </span>
                  <span className={`font-medium ${risk?.color} capitalize`}>
                    {risk?.level} risk
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AtRiskStudentAlert;