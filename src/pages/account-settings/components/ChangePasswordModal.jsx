import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        setTimeout(() => {
          onClose?.();
          setSuccess(false);
          setLoading(false);
        }, 2000);
      }, 1500);
    } catch (err) {
      setError('Failed to change password. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess(false);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Change Password</h2>
          <button
            onClick={() => {
              handleReset();
              onClose?.();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success State */}
          {success && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Check" size={32} className="text-success-foreground" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">Password Changed!</h3>
              <p className="text-sm text-muted-foreground">Your password has been successfully updated.</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-start space-x-2">
                  <Icon name="AlertCircle" size={18} className="text-error mt-0.5" />
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              {/* Current Password */}
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({
                    ...prev,
                    current: !prev.current
                  }))}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  <Icon name={showPasswords.current ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({
                    ...prev,
                    new: !prev.new
                  }))}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  <Icon name={showPasswords.new ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`h-1 flex-1 rounded ${
                      formData.newPassword.length >= 8 ? 'bg-success' : 'bg-muted-foreground'
                    }`}></div>
                    <span className="text-xs text-muted-foreground">
                      {formData.newPassword.length >= 8 ? 'Strong' : 'Weak'}
                    </span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center space-x-1">
                      <Icon 
                        name={formData.newPassword.length >= 8 ? 'Check' : 'X'} 
                        size={12}
                        className={formData.newPassword.length >= 8 ? 'text-success' : 'text-muted-foreground'}
                      />
                      <span>At least 8 characters</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({
                    ...prev,
                    confirm: !prev.confirm
                  }))}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  <Icon name={showPasswords.confirm ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>

              {/* Password Requirements */}
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="text-sm font-medium text-primary mb-2">Password Requirements:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• At least 8 characters</li>
                  <li>• Mix of uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character (@, #, $, etc.)</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  loading={loading}
                  iconName="Lock"
                  iconPosition="left"
                >
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleReset}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
