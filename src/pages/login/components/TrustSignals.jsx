import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      name: 'UGC Approved',
      icon: 'Shield',
      description: 'University Grants Commission Certified'
    },
    {
      name: 'NAAC Accredited',
      icon: 'Award',
      description: 'National Assessment and Accreditation Council'
    },
    {
      name: 'ISO 27001',
      icon: 'Lock',
      description: 'Information Security Management'
    },
    {
      name: 'Digital India',
      icon: 'Smartphone',
      description: 'Government of India Initiative'
    }
  ];

  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'End-to-end encryption'
    },
    {
      icon: 'Eye',
      text: 'Biometric verification'
    },
    {
      icon: 'Clock',
      text: 'Real-time monitoring'
    },
    {
      icon: 'Database',
      text: 'Secure data storage'
    }
  ];

  return (
    <div className="space-y-8">
      {/* College Branding */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-7">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground">AttendEase</h1>
            <p className="text-sm text-muted-foreground">Smart Attendance System</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Trusted by 500+ educational institutions across India for secure and efficient attendance management
        </p>
      </div>
      {/* Certifications */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 text-center">
          Certified & Compliant
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {certifications?.map((cert, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-background rounded-md"
            >
              <Icon name={cert?.icon} size={16} className="text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">{cert?.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {cert?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Features */}
      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-success mb-3 text-center flex items-center justify-center space-x-2">
          <Icon name="ShieldCheck" size={16} />
          <span>Security Features</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name={feature?.icon} size={14} className="text-success" />
              <span className="text-xs text-foreground">{feature?.text}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Statistics */}
      <div className="text-center space-y-2">
        <div className="flex justify-center space-x-6">
          <div>
            <p className="text-lg font-bold text-primary">500+</p>
            <p className="text-xs text-muted-foreground">Institutions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-secondary">50K+</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div>
            <p className="text-lg font-bold text-success">99.9%</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;