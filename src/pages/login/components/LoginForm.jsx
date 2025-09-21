import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock credentials for different roles
  const mockCredentials = {
    student: { email: 'student@college.edu', password: 'student123' },
    faculty: { email: 'faculty@college.edu', password: 'faculty123' },
    administrator: { email: 'admin@college.edu', password: 'admin123' }
  };

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'administrator', label: 'Administrator' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData?.email || !formData?.password || !formData?.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Mock authentication
    setTimeout(() => {
      const mockCred = mockCredentials?.[formData?.role];
      
      if (formData?.email === mockCred?.email && formData?.password === mockCred?.password) {
        // Store user data
        const userData = {
          name: formData?.role === 'student' ? 'Rahul Sharma' : 
                formData?.role === 'faculty' ? 'Dr. Priya Patel' : 'Admin Kumar',
          email: formData?.email,
          role: formData?.role,
          id: formData?.role === 'student' ? 'ST2024001' : 
              formData?.role === 'faculty' ? 'FC2024001' : 'AD2024001'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Navigate based on role
        const dashboardRoutes = {
          student: '/student-dashboard',
          faculty: '/faculty-dashboard',
          administrator: '/faculty-dashboard'
        };
        
        navigate(dashboardRoutes?.[formData?.role]);
      } else {
        setError('Invalid credentials. Please check your email, password, and role selection.');
      }
      setLoading(false);
    }, 1500);
  };

  const handleBiometricAuth = () => {
    // Mock biometric authentication
    setError('Biometric authentication is not available on this device');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} className="text-error" />
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your college email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            required
            disabled={loading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
              disabled={loading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          <Select
            label="Role"
            placeholder="Select your role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
            disabled={loading}
          />
          
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={loading}
            iconName="LogIn"
            iconPosition="right"
          >
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleBiometricAuth}
            iconName="Fingerprint"
            iconPosition="left"
            disabled={loading}
          >
            Biometric Authentication
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;