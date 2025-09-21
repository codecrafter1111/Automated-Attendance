import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsCard = ({ user }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Scan QR Code',
      description: 'Mark attendance using QR scanner',
      icon: 'QrCode',
      color: 'bg-primary',
      iconColor: 'white',
      action: () => navigate('/qr-code-scanner'),
      urgent: true
    },
    {
      title: 'View History',
      description: 'Check detailed attendance records',
      icon: 'History',
      color: 'bg-secondary',
      iconColor: 'white',
      action: () => navigate('/student-attendance-history')
    },
    {
      title: 'Request Correction',
      description: 'Submit attendance correction request',
      icon: 'Edit',
      color: 'bg-warning',
      iconColor: 'white',
      action: () => {
        // Mock action for correction request
        alert('Attendance correction request feature coming soon!');
      }
    },
    {
      title: 'Download Report',
      description: 'Export attendance summary',
      icon: 'Download',
      color: 'bg-success',
      iconColor: 'white',
      action: () => {
        // Mock download action
        const element = document.createElement('a');
        const file = new Blob([`Attendance Report for ${user?.name}\nGenerated on: ${new Date().toLocaleDateString('en-IN')}\n\nThis is a sample attendance report.`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `attendance-report-${new Date()?.toISOString()?.split('T')?.[0]}.txt`;
        document.body?.appendChild(element);
        element?.click();
        document.body?.removeChild(element);
      }
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.action}
            className="text-left p-4 rounded-lg border border-border hover:shadow-card transition-smooth group"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-smooth`}>
                <Icon name={action?.icon} size={20} color={action?.iconColor} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                    {action?.title}
                  </h4>
                  {action?.urgent && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      Priority
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
              />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Bell" size={16} />
            <span>Notifications enabled for low attendance alerts</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsCard;