import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ClassHeader from './components/ClassHeader';
import AttendanceMethodsPanel from './components/AttendanceMethodsPanel';
import StudentListHeader from './components/StudentListHeader';
import StudentCard from './components/StudentCard';
import SessionControls from './components/SessionControls';
import BiometricScannerModal from './components/BiometricScannerModal';
import Icon from '../../components/AppIcon';


const ClassAttendanceMarking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Session state
  const [sessionActive, setSessionActive] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());

  // Attendance methods state
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [biometricActive, setBiometricActive] = useState(false);
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(false);
  const [biometricScannerOpen, setBiometricScannerOpen] = useState(false);
  const [biometricMode, setBiometricMode] = useState('verify'); // 'verify' or 'enroll'

  // Student list state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // Mock class data
  const [classInfo] = useState({
    id: "CS2021-DSA-A",
    subject: "Data Structures and Algorithms",
    time: "10:00 AM - 11:30 AM",
    room: "Room 301, CS Block",
    location: "Room 301, CS Block",
    date: "13th September 2025",
    status: "active",
    faculty: "Dr. Rajesh Kumar"
  });

  // Mock students data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      rollNumber: "CS2021001",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      status: "present",
      verificationMethod: "qr",
      timestamp: Date.now() - 300000,
      notes: ""
    },
    {
      id: 2,
      name: "Priya Patel",
      rollNumber: "CS2021002",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      status: "present",
      verificationMethod: "face",
      timestamp: Date.now() - 600000,
      notes: ""
    },
    {
      id: 3,
      name: "Amit Kumar",
      rollNumber: "CS2021003",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      status: "present",
      verificationMethod: "biometric",
      timestamp: Date.now() - 420000,
      notes: ""
    },
    {
      id: 4,
      name: "Sneha Gupta",
      rollNumber: "CS2021004",
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
      status: "late",
      verificationMethod: "manual",
      timestamp: Date.now() - 180000,
      notes: "Arrived 15 minutes late"
    },
    {
      id: 5,
      name: "Vikram Singh",
      rollNumber: "CS2021005",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      status: "absent",
      verificationMethod: null,
      timestamp: null,
      notes: ""
    },
    {
      id: 6,
      name: "Anita Desai",
      rollNumber: "CS2021006",
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
      status: "present",
      verificationMethod: "qr",
      timestamp: Date.now() - 240000,
      notes: ""
    },
    {
      id: 7,
      name: "Ravi Mehta",
      rollNumber: "CS2021007",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
      status: "present",
      verificationMethod: "biometric",
      timestamp: Date.now() - 360000,
      notes: ""
    },
    {
      id: 8,
      name: "Kavya Nair",
      rollNumber: "CS2021008",
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
      status: "absent",
      verificationMethod: null,
      timestamp: null,
      notes: ""
    }
  ]);

  // Calculate attendance statistics
  const attendanceStats = {
    total: students?.length,
    present: students?.filter(s => s?.status === 'present')?.length,
    absent: students?.filter(s => s?.status === 'absent')?.length,
    late: students?.filter(s => s?.status === 'late')?.length
  };

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser?.role !== 'faculty') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter and sort students
  const filteredStudents = students?.filter(student => {
      const matchesSearch = student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesFilter = filterStatus === 'all' || student?.status === filterStatus;
      return matchesSearch && matchesFilter;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'rollNumber':
          return a?.rollNumber?.localeCompare(b?.rollNumber);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        default:
          return 0;
      }
    });

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev?.includes(studentId) 
        ? prev?.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedStudents([]);
      setAllSelected(false);
    } else {
      setSelectedStudents(filteredStudents?.map(s => s?.id));
      setAllSelected(true);
    }
  };

  // Handle attendance status changes
  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prev => prev?.map(student => 
      student?.id === studentId 
        ? { 
            ...student, 
            status: newStatus,
            timestamp: newStatus !== 'absent' ? Date.now() : null,
            verificationMethod: newStatus !== 'absent' ? 'manual' : null
          }
        : student
    ));
    setHasUnsavedChanges(true);
  };

  // Handle bulk operations
  const handleBulkStatusChange = (status) => {
    setStudents(prev => prev?.map(student => 
      selectedStudents?.includes(student?.id)
        ? { 
            ...student, 
            status,
            timestamp: status !== 'absent' ? Date.now() : null,
            verificationMethod: status !== 'absent' ? 'manual' : null
          }
        : student
    ));
    setSelectedStudents([]);
    setAllSelected(false);
    setHasUnsavedChanges(true);
  };

  // Handle attendance methods
  const handleGenerateQR = () => {
    setQrCodeVisible(true);
  };

  const handleToggleBiometric = () => {
    if (!biometricActive) {
      // Opening biometric scanner
      setBiometricMode('verify');
      setBiometricScannerOpen(true);
    } else {
      setBiometricActive(false);
    }
  };

  const handleToggleFaceRecognition = () => {
    setFaceRecognitionActive(!faceRecognitionActive);
  };

  const handleBiometricSuccess = (result) => {
    if (biometricMode === 'verify') {
      // Mark the verified student as present
      handleStatusChange(result.studentId, 'present');
      setBiometricActive(true);
      setBiometricScannerOpen(false);
    } else {
      // Enrollment successful, continue scanning
      setBiometricScannerOpen(false);
    }
  };

  const handleBiometricVerifyStudent = (studentId) => {
    // Open biometric scanner for a specific student
    setBiometricMode('verify');
    setBiometricScannerOpen(true);
    // The modal will handle student selection
  };

  // Handle session controls
  const handleStartSession = () => {
    setSessionActive(true);
  };

  const handleEndSession = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to save before ending the session?')) {
        handleSaveAttendance();
      }
    }
    setSessionActive(false);
    setQrCodeVisible(false);
    setBiometricActive(false);
    setFaceRecognitionActive(false);
  };

  const handleSaveAttendance = () => {
    // Simulate saving attendance
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setLastSyncTime(Date.now());
    }, 1000);
  };

  const handleSyncOfflineData = () => {
    // Simulate syncing offline data
    setTimeout(() => {
      setLastSyncTime(Date.now());
    }, 2000);
  };

  const handleVerifyProxy = (studentId) => {
    // Handle proxy verification
    console.log('Verifying proxy for student:', studentId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[5vw] bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Class Header */}
          <ClassHeader
            classInfo={classInfo}
            attendanceStats={attendanceStats}
            onGenerateQR={handleGenerateQR}
            onToggleBiometric={handleToggleBiometric}
            onToggleFaceRecognition={handleToggleFaceRecognition}
            biometricActive={biometricActive}
            faceRecognitionActive={faceRecognitionActive}
            isOfflineMode={isOfflineMode}
          />

          {/* Attendance Methods Panel */}
          <AttendanceMethodsPanel
            qrCodeVisible={qrCodeVisible}
            onCloseQR={() => setQrCodeVisible(false)}
            biometricActive={biometricActive}
            faceRecognitionActive={faceRecognitionActive}
            onBulkMarkPresent={() => handleBulkStatusChange('present')}
            onBulkMarkAbsent={() => handleBulkStatusChange('absent')}
            selectedStudents={selectedStudents}
            classInfo={classInfo}
          />

          {/* Student List Header */}
          <StudentListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            selectedCount={selectedStudents?.length}
            totalCount={filteredStudents?.length}
            onBulkActions={handleBulkStatusChange}
          />

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filteredStudents?.map(student => (
              <StudentCard
                key={student?.id}
                student={student}
                isSelected={selectedStudents?.includes(student?.id)}
                onSelect={handleStudentSelect}
                onStatusChange={handleStatusChange}
                onVerifyProxy={handleVerifyProxy}
                onBiometricVerify={handleBiometricVerifyStudent}
                showProxyAlert={student?.id === 5} // Mock proxy alert for demo
              />
            ))}
          </div>

          {filteredStudents?.length === 0 && (
            <div className="bg-card rounded-lg shadow-card border border-border p-8 text-center">
              <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria.' :'No students are enrolled in this class.'
                }
              </p>
            </div>
          )}

          {/* Session Controls */}
          <SessionControls
            sessionActive={sessionActive}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onSaveAttendance={handleSaveAttendance}
            onSyncOfflineData={handleSyncOfflineData}
            hasUnsavedChanges={hasUnsavedChanges}
            isOfflineMode={isOfflineMode}
            lastSyncTime={lastSyncTime}
          />
        </div>
      </main>

      {/* Biometric Scanner Modal */}
      <BiometricScannerModal
        isOpen={biometricScannerOpen}
        onClose={() => setBiometricScannerOpen(false)}
        onSuccess={handleBiometricSuccess}
        students={students}
        mode={biometricMode}
      />
    </div>
  );
};

export default ClassAttendanceMarking;