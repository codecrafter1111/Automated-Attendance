import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { verifyBiometric, enrollBiometric, isStudentEnrolled } from '../../../utils/biometricService';

const BiometricScannerModal = ({
  isOpen,
  onClose,
  onSuccess,
  students,
  mode = 'verify', // 'verify' or 'enroll'
}) => {
  const [scanning, setScanning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentList, setShowStudentList] = useState(mode === 'enroll');

  if (!isOpen) return null;

  const filteredStudents = students?.filter(student =>
    student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  ) || [];

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentList(false);
    setError(null);
    setMessage('');
    setStatus('idle');
  };

  const handleStartScan = async () => {
    if (!selectedStudent) {
      setError('Please select a student first');
      return;
    }

    setScanning(true);
    setStatus('scanning');
    setError(null);
    setMessage(`Initializing biometric scanner...`);

    try {
      if (mode === 'verify') {
        // Verify biometric
        const result = await verifyBiometric(selectedStudent.id);
        setStatus('success');
        setMessage(`✓ Biometric verified for ${selectedStudent.name}`);
        setScanning(false);

        // Call success callback
        setTimeout(() => {
          onSuccess?.(result);
          setTimeout(() => {
            onClose?.();
          }, 1000);
        }, 1500);
      } else {
        // Enroll biometric
        const result = await enrollBiometric(
          selectedStudent.id,
          selectedStudent.name
        );
        setStatus('success');
        setMessage(`✓ Biometric enrolled for ${selectedStudent.name}`);
        setScanning(false);

        // Call success callback
        setTimeout(() => {
          onSuccess?.(result);
          setTimeout(() => {
            setSelectedStudent(null);
            setShowStudentList(true);
          }, 1000);
        }, 1500);
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Biometric operation failed. Please try again.');
      setScanning(false);
      console.error('Biometric error:', err);
    }
  };

  const handleReset = () => {
    setSelectedStudent(null);
    setShowStudentList(mode === 'enroll');
    setError(null);
    setMessage('');
    setStatus('idle');
    setScanning(false);
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-modal border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/5 border-b-2 border-border sticky top-0 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
              <Icon name="Fingerprint" size={24} color="white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {mode === 'verify' ? '🔍 Verify Biometric' : '📝 Enroll Biometric'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-lg transition-all duration-200"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Selection */}
          {showStudentList ? (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label className="block text-sm font-bold text-foreground mb-3">
                  📋 Select Student to {mode === 'verify' ? 'Verify' : 'Enroll'}
                </label>
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full p-3 text-left border-2 border-border rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 flex items-center space-x-3 group"
                    >
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Roll: {student.rollNumber}
                        </p>
                      </div>
                      <Icon
                        name="ChevronRight"
                        size={20}
                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon
                        name="Search"
                        size={32}
                        className="text-muted-foreground"
                      />
                    </div>
                    <p className="text-muted-foreground font-medium">No students found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-xl border-2 border-primary/20 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-slide-in">
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 shadow-md ring-4 ring-primary/20"
                  />
                  <h3 className="font-bold text-lg text-foreground">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Roll: {selectedStudent.rollNumber}
                  </p>
                </div>
              )}

              {/* Scanner Visual */}
              {scanning && status === 'scanning' && (
                <div className="mb-6 text-center space-y-4 animate-fade-in-up">
                  <div className="flex justify-center">
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 animate-pulse"></div>
                      <div className="absolute inset-2 border-4 border-primary rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full flex items-center justify-center">
                          <Icon name="Fingerprint" size={48} className="text-primary animate-bounce-gentle" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground font-bold text-lg">🔄 Scanning...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Place your finger on the biometric scanner
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {status === 'success' && (
                <div className="mb-6 text-center space-y-4 animate-fade-in-up">
                  <div className="flex justify-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-success to-success/60 rounded-full flex items-center justify-center shadow-lg ring-8 ring-success/20 animate-bounce-gentle">
                      <Icon name="Check" size={56} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground font-bold text-lg">
                      ✅ {mode === 'verify' ? 'Verified!' : 'Enrolled!'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{message}</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === 'error' && error && (
                <div className="mb-6 p-4 bg-gradient-to-br from-error/10 to-error/5 border-2 border-error/30 rounded-lg animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="AlertCircle" size={20} className="text-error" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-error">❌ Error</p>
                      <p className="text-sm text-error/80 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {message && status !== 'success' && status !== 'error' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/5 border-2 border-primary/30 rounded-lg animate-fade-in">
                  <p className="text-sm text-primary font-medium">ℹ️ {message}</p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="space-y-3">
                {!scanning && status !== 'success' && (
                  <>
                    <Button
                      fullWidth
                      variant="default"
                      onClick={handleStartScan}
                      disabled={!selectedStudent}
                      iconName="Fingerprint"
                      iconPosition="left"
                      className="shadow-button hover:shadow-lg"
                    >
                      {mode === 'verify' ? '🔍 Verify Biometric' : '📝 Enroll Biometric'}
                    </Button>

                    <Button
                      fullWidth
                      variant="outline"
                      onClick={handleReset}
                      className="hover:border-primary hover:text-primary"
                    >
                      {mode === 'enroll' ? '↩️ Select Different Student' : '← Back'}
                    </Button>
                  </>
                )}

                {status === 'success' && (
                  <Button
                    fullWidth
                    variant="success"
                    onClick={() => {
                      if (mode === 'enroll') {
                        handleReset();
                      } else {
                        onClose?.();
                      }
                    }}
                    className="shadow-button"
                  >
                    {mode === 'enroll' ? '➕ Enroll Another' : '✓ Done'}
                  </Button>
                )}

                {status === 'error' && (
                  <Button
                    fullWidth
                    variant="default"
                    onClick={handleStartScan}
                    iconName="RotateCw"
                    iconPosition="left"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricScannerModal;
