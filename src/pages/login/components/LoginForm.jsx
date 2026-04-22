import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { verifyBiometric, isStudentEnrolled, isBiometricAvailable } from '../../../utils/biometricService';
import studentData from '../../../Data/student';
import facultyData from '../../../Data/faculty';

const dashboardRoutes = {
  student: '/student-dashboard',
  faculty: '/faculty-dashboard',
};

const buildStableUserId = (role, email) => {
  const prefix = role === 'faculty' ? 'FA' : 'ST';
  const normalizedEmail = String(email || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${prefix}_${normalizedEmail}`;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' }
  ];

  const validateCredentials = (email, password, role) => {
    if (role === 'student') {
      return studentData.find(s => s.email === email && s.password === password);
    } else if (role === 'faculty') {
      return facultyData.find(f => f.email === email && f.password === password);
    }
    return null;
  };

  const handlePostLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));

    const redirectTo = searchParams.get('redirect');
    if (redirectTo) {
      const decodedRedirect = decodeURIComponent(redirectTo);
      navigate(decodedRedirect);
      return;
    }

    navigate(dashboardRoutes[userData.role] || '/student-dashboard');
  };

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

    // Validate against actual user data
    setTimeout(() => {
      const user = validateCredentials(formData?.email, formData?.password, formData?.role);
      
      if (user) {
        const userData = {
          name: user.username,
          email: formData?.email,
          role: formData?.role,
          id: buildStableUserId(formData?.role, formData?.email),
        };

        handlePostLogin(userData);
      } else {
        setError(`Invalid credentials. No ${formData?.role} account found with this email and password.`);
      }
      setLoading(false);
    }, 1500);
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if biometric is available
      const biometricInfo = await isBiometricAvailable();
      if (!biometricInfo.isAvailable && !biometricInfo.webauthnSupported) {
        setError('Biometric authentication is not available on this device. Please use your email and password instead.');
        setLoading(false);
        return;
      }

      if (!formData?.email || !formData?.role) {
        setError('Please enter your email and select role before biometric authentication.');
        setLoading(false);
        return;
      }

      const userCollection = formData.role === 'student' ? studentData : facultyData;
      const matchedUser = userCollection.find((item) => item.email === formData.email);

      if (!matchedUser) {
        setError(`No ${formData.role} account found with this email. Please check role/email or use password login.`);
        setLoading(false);
        return;
      }

      const biometricUserId = buildStableUserId(formData.role, formData.email);

      // isStudentEnrolled checks enrollment by biometric ID key; it works for both roles.
      if (!isStudentEnrolled(biometricUserId)) {
        setError('No biometric enrollment found for this account. Please login with email/password first and enroll biometric in Account Settings.');
        setLoading(false);
        return;
      }

      // Verify biometric
      const result = await verifyBiometric(biometricUserId);
      
      if (result.verified) {
        const userData = {
          name: matchedUser.username,
          email: formData.email,
          role: formData.role,
          id: biometricUserId,
        };

        handlePostLogin(userData);
      }
    } catch (err) {
      setError(err.message || 'Biometric authentication failed. Please try again or use email/password login.');
      console.error('Biometric auth error:', err);
    } finally {
      setLoading(false);
    }
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