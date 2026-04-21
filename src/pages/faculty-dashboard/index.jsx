import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import TodayClassCard from './components/TodayClassCard';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import AtRiskStudentAlert from './components/AtRiskStudentAlert';
import SummaryMetrics from './components/SummaryMetrics';
import QuickActions from './components/QuickActions';
import LiveAttendanceSession from './components/LiveAttendanceSession';
import AssignmentManagement from './components/AssignmentManagement';
import Icon from '../../components/AppIcon';


const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [liveSession, setLiveSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for faculty dashboard
  const todayClasses = [
    {
      id: 1,
      name: "Data Structures and Algorithms",
      subjectCode: "CS301",
      time: "09:00 AM - 10:30 AM",
      room: "Room 101, CS Block",
      enrolledStudents: 45,
      attendanceRate: 87,
      status: "upcoming"
    },
    {
      id: 2,
      name: "Database Management Systems",
      subjectCode: "CS302",
      time: "11:00 AM - 12:30 PM",
      room: "Room 205, CS Block",
      enrolledStudents: 38,
      attendanceRate: 92,
      status: "ongoing"
    },
    {
      id: 3,
      name: "Software Engineering",
      subjectCode: "CS303",
      time: "02:00 PM - 03:30 PM",
      room: "Room 301, CS Block",
      enrolledStudents: 42,
      attendanceRate: 78,
      status: "upcoming"
    },
    {
      id: 4,
      name: "Computer Networks",
      subjectCode: "CS304",
      time: "04:00 PM - 05:30 PM",
      room: "Room 102, CS Block",
      enrolledStudents: 35,
      attendanceRate: 85,
      status: "completed"
    }
  ];

  const summaryMetrics = {
    classesToday: 4,
    classesTodayChange: 1,
    averageAttendance: 86,
    attendanceChange: 3,
    pendingApprovals: 7,
    approvalsChange: -2,
    activeStudents: 160,
    studentsChange: 5
  };

  const weeklyAttendanceData = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 82 },
    { day: 'Thu', attendance: 90 },
    { day: 'Fri', attendance: 87 },
    { day: 'Sat', attendance: 79 },
    { day: 'Sun', attendance: 0 }
  ];

  const classWiseAttendanceData = [
    { class: 'CS301', rate: 87 },
    { class: 'CS302', rate: 92 },
    { class: 'CS303', rate: 78 },
    { class: 'CS304', rate: 85 },
    { class: 'CS305', rate: 89 }
  ];

  const atRiskStudents = [
    {
      id: 1,
      name: "Rahul Sharma",
      rollNumber: "CS2021001",
      class: "CS301",
      attendancePercentage: 45,
      classesAttended: 18,
      totalClasses: 40,
      lastAttended: "2 days ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      rollNumber: "CS2021015",
      class: "CS302",
      attendancePercentage: 62,
      classesAttended: 25,
      totalClasses: 40,
      lastAttended: "1 day ago"
    },
    {
      id: 3,
      name: "Amit Kumar",
      rollNumber: "CS2021032",
      class: "CS303",
      attendancePercentage: 38,
      classesAttended: 15,
      totalClasses: 40,
      lastAttended: "5 days ago"
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser?.role === 'faculty' || parsedUser?.role === 'administrator') {
        setUser(parsedUser);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleStartAttendance = (classData) => {
    // Create live session
    const newSession = {
      id: Date.now(),
      className: classData?.name,
      room: classData?.room,
      time: classData?.time,
      totalStudents: classData?.enrolledStudents,
      presentCount: 0,
      startTime: new Date(),
      recentAttendance: []
    };
    setLiveSession(newSession);
    navigate('/class-attendance-marking', { state: { classData } });
  };

  const handleViewDetails = (classData) => {
    navigate('/student-attendance-history', { state: { classData } });
  };

  const handleViewStudent = (student) => {
    navigate('/student-attendance-history', { state: { student } });
  };

  const handleSendAlert = (student) => {
    // Mock alert sending
    alert(`Alert sent to ${student?.name} (${student?.rollNumber})`);
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'generate-qr': navigate('/class-attendance-marking');
        break;
      case 'bulk-attendance': navigate('/class-attendance-marking', { state: { mode: 'bulk' } });
        break;
      case 'generate-report': navigate('/student-attendance-history', { state: { mode: 'report' } });
        break;
      case 'schedule-class': alert('Schedule class functionality would open a modal or navigate to scheduling page');
        break;
      case 'assignments': setActiveTab('assignments');
        break;
      default:
        break;
    }
  };

  const handleEndSession = (sessionId) => {
    setLiveSession(null);
    alert('Attendance session ended successfully');
  };

  const handleMarkStudent = (method) => {
    if (method === 'manual') {
      alert('Manual attendance marking would open a student selection modal');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[5vw] bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, Prof. {user?.name}! Manage your classes and monitor student attendance.
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Today: {new Date()?.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                { id: 'assignments', label: 'Assignments', icon: 'BookOpen' }
              ]?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Summary Metrics */}
              <SummaryMetrics metrics={summaryMetrics} />

              {/* Live Session Alert */}
              {liveSession && (
                <LiveAttendanceSession
                  session={liveSession}
                  onEndSession={handleEndSession}
                  onMarkStudent={handleMarkStudent}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Today's Classes */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground">Today's Classes</h2>
                      <span className="text-sm text-muted-foreground">
                        {todayClasses?.length} classes scheduled
                      </span>
                    </div>
                    <div className="space-y-4">
                      {todayClasses?.map((classData) => (
                        <TodayClassCard
                          key={classData?.id}
                          classData={classData}
                          onStartAttendance={handleStartAttendance}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Attendance Analytics */}
                  <AttendanceAnalytics
                    weeklyData={weeklyAttendanceData}
                    classWiseData={classWiseAttendanceData}
                  />
                </div>

                {/* Sidebar */}
                <div className="space-y-6 mt-[3.4vw]">
                  {/* Quick Actions */}
                  <QuickActions onAction={handleQuickAction} />

                  {/* At-Risk Students */}
                  <AtRiskStudentAlert
                    students={atRiskStudents}
                    onViewStudent={handleViewStudent}
                    onSendAlert={handleSendAlert}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'assignments' && (
            <AssignmentManagement />
          )}
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;