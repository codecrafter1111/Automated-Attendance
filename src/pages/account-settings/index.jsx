import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Input from '../../components/ui/Input';
import { isBiometricAvailable, isStudentEnrolled, enrollBiometric, removeBiometricEnrollment } from '../../utils/biometricService';
import BiometricEnrollmentModal from './components/BiometricEnrollmentModal';
import ChangePasswordModal from './components/ChangePasswordModal';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnrolled, setBioEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, notifications, privacy
  const [bioEnrollmentOpen, setBioEnrollmentOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock user profile data
  const [profile, setProfile] = useState({
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'student@college.edu',
    phone: '+91-9876543210',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    year: '3rd Year',
    batch: 'Batch 2022',
    enrollmentDate: '2022-08-15',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  // Load user and biometric data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Update profile with user name if available
      setProfile(prev => ({
        ...prev,
        firstName: parsedUser.name?.split(' ')[0] || prev.firstName,
        lastName: parsedUser.name?.split(' ')[1] || prev.lastName,
        email: parsedUser.email || prev.email
      }));

      // Check biometric availability
      checkBiometric(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const checkBiometric = async (userId) => {
    try {
      const available = await isBiometricAvailable();
      setBioAvailable(available);
      
      const enrolled = isStudentEnrolled(userId);
      setBioEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking biometric:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBioEnrollmentSuccess = () => {
    setBioEnrolled(true);
    setSuccessMessage('Biometric enrollment successful!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveBiometric = () => {
    if (window.confirm('Are you sure you want to remove your biometric enrollment? You will need to re-enroll to use biometric authentication.')) {
      if (removeBiometricEnrollment(user.id)) {
        setBioEnrolled(false);
        setSuccessMessage('Biometric enrollment removed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setEditingProfile(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[5vw] bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      
      <main className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account, security, and preferences</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <p className="text-success text-sm font-medium">{successMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-20">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-3 text-left font-medium transition-colors flex items-center space-x-3 ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="User" size={18} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-3 text-left font-medium transition-colors flex items-center space-x-3 border-t border-border ${
                      activeTab === 'security'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="Lock" size={18} />
                    <span>Security</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-4 py-3 text-left font-medium transition-colors flex items-center space-x-3 border-t border-border ${
                      activeTab === 'notifications'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="Bell" size={18} />
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`px-4 py-3 text-left font-medium transition-colors flex items-center space-x-3 border-t border-border ${
                      activeTab === 'privacy'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="Shield" size={18} />
                    <span>Privacy</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Avatar Section */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                      <Icon name="User" size={24} />
                      <span>Profile Information</span>
                    </h2>

                    <div className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center space-x-6">
                        <img
                          src={profile.avatar}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{profile.rollNumber}</p>
                          <p className="text-sm text-muted-foreground">{profile.department}</p>
                        </div>
                      </div>

                      {/* Profile Form */}
                      {editingProfile ? (
                        <div className="space-y-4 pt-4 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="First Name"
                              value={editedProfile.firstName}
                              onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            />
                            <Input
                              label="Last Name"
                              value={editedProfile.lastName}
                              onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            />
                            <Input
                              label="Email Address"
                              type="email"
                              value={editedProfile.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                            />
                            <Input
                              label="Phone Number"
                              value={editedProfile.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                            />
                            <Input
                              label="Roll Number"
                              value={editedProfile.rollNumber}
                              disabled
                            />
                            <Input
                              label="Department"
                              value={editedProfile.department}
                              disabled
                            />
                            <Input
                              label="Year"
                              value={editedProfile.year}
                              disabled
                            />
                            <Input
                              label="Batch"
                              value={editedProfile.batch}
                              disabled
                            />
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <Button
                              variant="default"
                              onClick={handleSaveProfile}
                              iconName="Save"
                              iconPosition="left"
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingProfile(false);
                                setEditedProfile(profile);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-4 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">First Name</p>
                              <p className="text-foreground font-medium">{profile.firstName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                              <p className="text-foreground font-medium">{profile.lastName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email</p>
                              <p className="text-foreground font-medium">{profile.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Phone</p>
                              <p className="text-foreground font-medium">{profile.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Roll Number</p>
                              <p className="text-foreground font-medium">{profile.rollNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Department</p>
                              <p className="text-foreground font-medium">{profile.department}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Year</p>
                              <p className="text-foreground font-medium">{profile.year}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Batch</p>
                              <p className="text-foreground font-medium">{profile.batch}</p>
                            </div>
                          </div>

                          <Button
                            variant="default"
                            onClick={() => setEditingProfile(true)}
                            iconName="Edit"
                            iconPosition="left"
                            className="mt-4"
                          >
                            Edit Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Password Section */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                      <Icon name="Lock" size={24} />
                      <span>Password</span>
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">Password</h3>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setChangePasswordOpen(true)}
                        iconName="RefreshCw"
                        iconPosition="left"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>

                  {/* Biometric Authentication Section */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                      <Icon name="Fingerprint" size={24} />
                      <span>Biometric Authentication</span>
                    </h2>

                    {!bioAvailable ? (
                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start space-x-3">
                        <Icon name="AlertCircle" size={20} className="text-warning mt-0.5" />
                        <div>
                          <h4 className="font-medium text-warning mb-1">Not Available</h4>
                          <p className="text-sm text-warning/80">
                            Biometric authentication is not available on this device. Please use a device with biometric capabilities (fingerprint, face recognition, etc.).
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground flex items-center space-x-2">
                                <Icon
                                  name="Fingerprint"
                                  size={20}
                                  className={bioEnrolled ? 'text-success' : 'text-muted-foreground'}
                                />
                                <span>Fingerprint Enrollment</span>
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {bioEnrolled
                                  ? 'Your fingerprint is enrolled and ready to use for authentication'
                                  : 'Enroll your fingerprint to use biometric authentication for faster login'}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              bioEnrolled
                                ? 'bg-success text-success-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {bioEnrolled ? 'Enrolled' : 'Not Enrolled'}
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            {bioEnrolled ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBioEnrollmentOpen(true)}
                                  iconName="RefreshCw"
                                  iconPosition="left"
                                >
                                  Re-enroll
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={handleRemoveBiometric}
                                  iconName="Trash2"
                                  iconPosition="left"
                                >
                                  Remove
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="default"
                                onClick={() => setBioEnrollmentOpen(true)}
                                iconName="Fingerprint"
                                iconPosition="left"
                              >
                                Enroll Fingerprint
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Biometric Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                            <Icon name="Zap" size={20} className="text-success mb-2" />
                            <h5 className="font-medium text-foreground mb-1">Faster Login</h5>
                            <p className="text-xs text-muted-foreground">
                              Skip password entry and authenticate instantly
                            </p>
                          </div>
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                            <Icon name="Shield" size={20} className="text-primary mb-2" />
                            <h5 className="font-medium text-foreground mb-1">Secure</h5>
                            <p className="text-xs text-muted-foreground">
                              Your biometric data is encrypted and never shared
                            </p>
                          </div>
                          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                            <Icon name="Smartphone" size={20} className="text-secondary mb-2" />
                            <h5 className="font-medium text-foreground mb-1">Always With You</h5>
                            <p className="text-xs text-muted-foreground">
                              Use your device's built-in biometric sensor
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                      <Icon name="Smartphone" size={24} />
                      <span>Active Sessions</span>
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">MacBook Pro (Current)</h4>
                          <p className="text-sm text-muted-foreground">Safari • India • Last active now</p>
                        </div>
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">iPhone 14 Pro</h4>
                          <p className="text-sm text-muted-foreground">Safari • India • Last active 2 hours ago</p>
                        </div>
                        <Button variant="ghost" size="sm" iconName="X" iconSize={16} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                    <Icon name="Bell" size={24} />
                    <span>Notification Preferences</span>
                  </h2>

                  <div className="space-y-4">
                    {[
                      { title: 'Attendance Marked', description: 'Get notified when your attendance is marked' },
                      { title: 'Low Attendance', description: 'Alert when your attendance falls below 75%' },
                      { title: 'Class Updates', description: 'Receive updates about class schedule changes' },
                      { title: 'Assignment Reminders', description: 'Get reminded about upcoming assignments' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                      <Icon name="Shield" size={24} />
                      <span>Privacy Settings</span>
                    </h2>

                    <div className="space-y-4">
                      {[
                        { title: 'Profile Visibility', description: 'Control who can see your profile' },
                        { title: 'Attendance Visibility', description: 'Control who can see your attendance records' },
                        { title: 'Activity Status', description: 'Show your online/offline status' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data & Privacy */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Data & Privacy</h3>
                    <div className="space-y-3">
                      <Button variant="outline" fullWidth className="justify-start">
                        <Icon name="Download" size={18} className="mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="outline" fullWidth className="justify-start">
                        <Icon name="Trash2" size={18} className="mr-2" />
                        Request Account Deletion
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Biometric Enrollment Modal */}
      <BiometricEnrollmentModal
        isOpen={bioEnrollmentOpen}
        onClose={() => setBioEnrollmentOpen(false)}
        onSuccess={handleBioEnrollmentSuccess}
        userId={user?.id}
        userName={`${profile.firstName} ${profile.lastName}`}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
};

export default AccountSettings;
