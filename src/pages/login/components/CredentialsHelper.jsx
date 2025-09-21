import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsHelper = () => {
  const [showCredentials, setShowCredentials] = useState(false);

  const mockCredentials = [
    {
      role: 'Student',
      email: 'student@college.edu',
      password: 'student123',
      name: 'Rahul Sharma',
      id: 'ST2024001',
      color: 'text-primary'
    },
    {
      role: 'Faculty',
      email: 'faculty@college.edu',
      password: 'faculty123',
      name: 'Dr. Priya Patel',
      id: 'FC2024001',
      color: 'text-secondary'
    },
    {
      role: 'Administrator',
      email: 'admin@college.edu',
      password: 'admin123',
      name: 'Admin Kumar',
      id: 'AD2024001',
      color: 'text-success'
    }
  ];

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowCredentials(!showCredentials)}
        iconName={showCredentials ? 'ChevronUp' : 'ChevronDown'}
        iconPosition="right"
        className="w-full justify-center"
      >
        Demo Credentials
      </Button>
      {showCredentials && (
        <div className="mt-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Demo Access</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Use these credentials to explore different user roles in the system
            </p>
          </div>

          <div className="space-y-2">
            {mockCredentials?.map((cred, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={cred?.role === 'Student' ? 'GraduationCap' : 
                            cred?.role === 'Faculty' ? 'Users' : 'Settings'} 
                      size={16} 
                      className={cred?.color} 
                    />
                    <span className={`text-sm font-medium ${cred?.color}`}>
                      {cred?.role}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{cred?.id}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={12} className="text-muted-foreground" />
                    <span className="text-xs font-mono text-foreground">{cred?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Key" size={12} className="text-muted-foreground" />
                    <span className="text-xs font-mono text-foreground">{cred?.password}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <p className="text-xs text-warning font-medium">
                Demo purposes only - Use provided credentials exactly as shown
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;