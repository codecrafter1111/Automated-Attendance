import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ClassHeader from './components/ClassHeader';
import AttendanceMethodsPanel from './components/AttendanceMethodsPanel';
import StudentListHeader from './components/StudentListHeader';
import StudentCard from './components/StudentCard';
import SessionControls from './components/SessionControls';
import BiometricScannerModal from './components/BiometricScannerModal';
import Icon from '../../components/AppIcon';
import { getAttendanceSubmissions, getLatestActiveSession, mergeRemoteAttendanceSubmissions, upsertAttendanceSession } from '../../utils/attendanceSessionStore';
import { fetchAttendanceFromMongo } from '../../utils/attendanceApi';

const RECENT_ACTIVITY_WINDOW_KEY = 'attendease_recent_activity_window';
const RECENT_ACTIVITY_WINDOWS = {
  '2h': 2 * 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  'full-day': 24 * 60 * 60 * 1000,
};


const ClassAttendanceMarking = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [recentWindowKey, setRecentWindowKey] = useState(() => {
    if (typeof window === 'undefined') return '4h';
    const saved = window.localStorage.getItem(RECENT_ACTIVITY_WINDOW_KEY);
    return RECENT_ACTIVITY_WINDOWS[saved] ? saved : '4h';
  });

  const getStoredFacultyName = () => {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) return null;
      const parsedUser = JSON.parse(rawUser);
      return parsedUser?.role === 'faculty' ? parsedUser?.name : null;
    } catch (error) {
      return null;
    }
  };

  // Class data from selected dashboard card (fallback to default when opened directly)
  const [classInfo] = useState(() => {
    const selectedClass = location?.state?.classData;
    const loggedInFacultyName = getStoredFacultyName();
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (selectedClass) {
      return {
        id: selectedClass.subjectCode || String(selectedClass.id || 'CS2021-DSA-A'),
        subject: selectedClass.name || selectedClass.subject || 'Data Structures and Algorithms',
        time: selectedClass.time || '10:00 AM - 11:30 AM',
        room: selectedClass.room || selectedClass.location || 'Room 301, CS Block',
        location: selectedClass.room || selectedClass.location || 'Room 301, CS Block',
        date: today,
        status: selectedClass.status === 'ongoing' ? 'active' : (selectedClass.status || 'active'),
        faculty: selectedClass.faculty || loggedInFacultyName || 'Dr. Rajesh Kumar',
      };
    }

    return {
      id: 'CS2021-DSA-A',
      subject: 'Data Structures and Algorithms',
      time: '10:00 AM - 11:30 AM',
      room: 'Room 301, CS Block',
      location: 'Room 301, CS Block',
      date: today,
      status: 'active',
      faculty: loggedInFacultyName || 'Dr. Rajesh Kumar',
    };
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

  const getClassSubmissions = () => {
    const safeSubmissions = getAttendanceSubmissions();
    if (!Array.isArray(safeSubmissions)) return [];

    const recentWindowMs = RECENT_ACTIVITY_WINDOWS[recentWindowKey] || RECENT_ACTIVITY_WINDOWS['4h'];
    const now = Date.now();

    return safeSubmissions
      .filter((item) => {
        if (item.classId !== classInfo.id || item.status !== 'present') return false;

        // QR session IDs rotate frequently; use recency to avoid dropping valid marks.
        const itemTimestamp = Number(item.timestamp) || 0;
        return itemTimestamp > 0 && now - itemTimestamp <= recentWindowMs;
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(RECENT_ACTIVITY_WINDOW_KEY, recentWindowKey);
  }, [recentWindowKey]);

  const applyQRSubmissions = () => {
    const submissions = getClassSubmissions();

    if (submissions.length === 0) return;

    setStudents((prev) => {
      let changed = false;
      const nextStudents = [...prev];

      const updated = nextStudents.map((student) => {
        const matchedSubmission = submissions.find((submission) => {
          const byName = submission.studentName && student.name === submission.studentName;
          const byId = submission.studentId && student.rollNumber === submission.studentId;
          return byName || byId;
        });

        if (!matchedSubmission) return student;

        if (
          student.status === 'present' &&
          student.verificationMethod === (matchedSubmission.method || 'qr') &&
          student.timestamp === matchedSubmission.timestamp
        ) {
          return student;
        }

        changed = true;
        return {
          ...student,
          status: 'present',
          verificationMethod: matchedSubmission.method || 'qr',
          timestamp: matchedSubmission.timestamp,
          notes: 'Marked from student QR page',
        };
      });

      const existingKeys = new Set(
        updated.map((student) => `${student.name}::${student.rollNumber || ''}`)
      );

      submissions.forEach((submission) => {
        const submissionName = submission.studentName || 'Unknown Student';
        const submissionRoll = submission.studentId || '';
        const key = `${submissionName}::${submissionRoll}`;

        if (existingKeys.has(key)) return;

        changed = true;
        existingKeys.add(key);
        updated.unshift({
          id: Date.now() + Math.floor(Math.random() * 10000),
          name: submissionName,
          rollNumber: submissionRoll || `NEW-${Math.floor(Math.random() * 1000)}`,
          photo: 'https://randomuser.me/api/portraits/lego/1.jpg',
          status: 'present',
          verificationMethod: submission.method || 'qr',
          timestamp: submission.timestamp,
          notes: 'Added from live attendance submission',
        });
      });

      return changed ? updated : prev;
    });
  };

  const formatMethodLabel = (method) => {
    const normalized = String(method || '').trim().toLowerCase();

    switch (normalized) {
      case 'qr':
      case 'qr_code':
      case 'qrcode':
        return 'QR Code';
      case 'face':
      case 'face_recognition':
      case 'facerecognition':
        return 'Face Recognition';
      case 'biometric':
      case 'fingerprint':
        return 'Biometric';
      case 'manual':
        return 'Manual';
      default:
        if (!normalized) return 'Unknown Method';
        return normalized
          .split(/[_\s-]+/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
    }
  };

  const recentActivity = getClassSubmissions().slice(0, 6).map((submission, index) => {
    const safeTimestamp = Number(submission.timestamp) || Date.now();
    const activityId = submission.id || `${submission.sessionId || 'session'}-${submission.studentId || submission.studentName || 'student'}-${safeTimestamp}-${index}`;

    return {
      id: activityId,
      studentName: submission.studentName || submission.studentId || 'Student',
      methodLabel: formatMethodLabel(submission.method),
      timeLabel: new Date(safeTimestamp).toLocaleTimeString(),
    };
  });

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

  useEffect(() => {
    applyQRSubmissions();

    const intervalId = setInterval(() => {
      applyQRSubmissions();
    }, 3000);

    const syncFromMongo = async () => {
      const remoteSubmissions = await fetchAttendanceFromMongo({ classId: classInfo.id, limit: 100 });
      if (remoteSubmissions?.length > 0) {
        mergeRemoteAttendanceSubmissions(
          remoteSubmissions.map((submission) => ({
            ...submission,
            timestamp: submission.timestamp ? new Date(submission.timestamp).getTime() : Date.now(),
          }))
        );
        applyQRSubmissions();
      }
    };

    syncFromMongo();
    const mongoSyncInterval = setInterval(syncFromMongo, 5000);

    const handleStorage = (event) => {
      if (event.key === 'attendease_attendance_submissions') {
        applyQRSubmissions();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(intervalId);
      clearInterval(mongoSyncInterval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [classInfo.id]);

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

  // Only keep students who recently marked attendance via QR
  const recentQRStudents = filteredStudents
    ?.filter((student) =>
      student?.status === 'present' &&
      student?.verificationMethod === 'qr' &&
      !!student?.timestamp
    )
    ?.sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));

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
      setSelectedStudents(recentQRStudents?.map(s => s?.id));
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

  const handleStopQR = () => {
    const activeSession = getLatestActiveSession();

    if (activeSession && activeSession.classId === classInfo.id) {
      upsertAttendanceSession({
        ...activeSession,
        endedAt: Date.now(),
      });
    }

    setQrCodeVisible(false);
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
            onCloseQR={handleStopQR}
            biometricActive={biometricActive}
            faceRecognitionActive={faceRecognitionActive}
            onBulkMarkPresent={() => handleBulkStatusChange('present')}
            onBulkMarkAbsent={() => handleBulkStatusChange('absent')}
            selectedStudents={selectedStudents}
            classInfo={classInfo}
            recentActivity={recentActivity}
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
            totalCount={recentQRStudents?.length}
            onBulkActions={handleBulkStatusChange}
          />

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {recentQRStudents?.map(student => (
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

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border p-5 mb-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Window
                <select
                  value={recentWindowKey}
                  onChange={(event) => setRecentWindowKey(event.target.value)}
                  className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="2h">Last 2 hours</option>
                  <option value="4h">Last 4 hours</option>
                  <option value="full-day">Full day</option>
                </select>
              </label>
            </div>
            <div className="space-y-2 text-sm">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="text-muted-foreground">
                    <span className="text-foreground font-medium">{activity.studentName}</span>{' '}
                    marked attendance via {activity.methodLabel}{' '}
                    <span className="text-xs">({activity.timeLabel})</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No attendance activity yet for this class.</div>
              )}
            </div>
          </div>

          {recentQRStudents?.length === 0 && (
            <div className="bg-card rounded-lg shadow-card border border-border p-8 text-center">
              <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Recent QR Attendance</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all'
                  ? 'No students match your search/filter with recent QR attendance.'
                  : 'No students have recently marked attendance via QR for this class.'
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