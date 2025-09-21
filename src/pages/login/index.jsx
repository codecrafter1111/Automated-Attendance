import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import CredentialsHelper from './components/CredentialsHelper';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      const dashboardRoutes = {
        student: '/student-dashboard',
        faculty: '/faculty-dashboard',
        administrator: '/faculty-dashboard'
      };
      navigate(dashboardRoutes?.[userData?.role] || '/student-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="min-h-screen flex">
        {/* Left Side - Trust Signals & Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border">
          <div className="flex flex-col justify-center px-12 py-16 w-full max-w-lg mx-auto">
            <TrustSignals />
            
            {/* Additional Features */}
            {/* <div className="mt-8 space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Multi-Modal Attendance</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  QR codes, biometrics, and facial recognition for comprehensive attendance tracking
                </p>
              </div>
              
              <div className="bg-secondary/5 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>Real-time Analytics</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Instant insights and reporting for better academic planning and student engagement
                </p>
              </div>
              
              <div className="bg-success/5 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Mobile Responsive</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Access from any device with offline capabilities and automatic sync
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">AttendEase</h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Smart Attendance Management System
              </p>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your attendance dashboard
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Demo Credentials Helper */}
            {/* <CredentialsHelper /> */}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} AttendEase. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Secure • Reliable • Compliant with Indian Education Standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;