import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'generate-qr',
      title: 'Generate QR Code',
      description: 'Create QR code for quick attendance',
      icon: 'QrCode',
      color: 'bg-primary',
      iconColor: 'white'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Create and manage assignments',
      icon: 'BookOpen',
      color: 'bg-secondary',
      iconColor: 'white'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create attendance reports with filters',
      icon: 'FileText',
      color: 'bg-success',
      iconColor: 'white'
    },
    {
      id: 'schedule-class',
      title: 'Schedule Class',
      description: 'Add new class to your schedule',
      icon: 'Calendar',
      color: 'bg-warning',
      iconColor: 'white'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onAction(action?.id)}
            className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:shadow-sm hover:border-primary/20 transition-smooth group"
          >
            <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-smooth`}>
              <Icon name={action?.icon} size={20} color={action?.iconColor} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                {action?.title}
              </h4>
              <p className="text-sm text-muted-foreground">{action?.description}</p>
            </div>
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;