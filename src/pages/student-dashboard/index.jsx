import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import DashboardNavigation from '../../components/ui/DashboardNavigation';
import AttendanceOverviewCard from './components/AttendanceOverviewCard';
import TodayClassesCard from './components/TodayClassesCard';
import SubjectAttendanceCard from './components/SubjectAttendanceCard';
import AttendanceCalendarCard from './components/AttendanceCalendarCard';
import QuickActionsCard from './components/QuickActionsCard';
import RecentActivityCard from './components/RecentActivityCard';
import Icon from '../../components/AppIcon';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for student dashboard
  const attendanceStats = {
    present: 42,
    absent: 8,
    late: 3,
    totalClasses: 53,
    percentage: 79
  };

  const todayClasses = [
    {
      id: 1,
      classId: "CS2021-DSA-A",
      code: "CS2021",
      section: "A",
      subject: "Data Structures & Algorithms",
      faculty: "Dr. Priya Sharma",
      startTime: "09:00",
      endTime: "10:00",
      location: "Room 301, CS Block",
      attendanceMarked: false
    },
    {
      id: 2,
      classId: "CS2021-DBMS-B",
      code: "CS2021",
      section: "B",
      subject: "Database Management Systems",
      faculty: "Prof. Rajesh Kumar",
      startTime: "10:00",
      endTime: "11:00",
      location: "Lab 205, IT Block",
      attendanceMarked: true
    },
    {
      id: 3,
      classId: "CS2021-SE-C",
      code: "CS2021",
      section: "C",
      subject: "Software Engineering",
      faculty: "Dr. Anita Verma",
      startTime: "11:00",
      endTime: "12:00",
      location: "Room 102, Main Block",
      attendanceMarked: false
    },
    {
      id: 4,
      classId: "CS2021-CN-D",
      code: "CS2021",
      section: "D",
      subject: "Computer Networks",
      faculty: "Prof. Suresh Patel",
      startTime: "12:00",
      endTime: "13:00",
      location: "Lab 301, IT Block",
      attendanceMarked: false
    },
    {
      id: 5,
      classId: "CS2021-OOP-E",
      code: "CS2021",
      section: "E",
      subject: "Object Oriented Programming",
      faculty: "Dr. Kavita Rao",
      startTime: "13:00",
      endTime: "14:00",
      location: "Room 210, CS Block",
      attendanceMarked: false
    },
    {
      id: 6,
      classId: "CS2021-AI-F",
      code: "CS2021",
      section: "F",
      subject: "Artificial Intelligence",
      faculty: "Dr. Neeraj Singh",
      startTime: "14:00",
      endTime: "15:00",
      location: "Room 405, AI Block",
      attendanceMarked: false
    },
    {
      id: 7,
      classId: "CS2021-WD-G",
      code: "CS2021",
      section: "G",
      subject: "Web Development",
      faculty: "Prof. Meera Nair",
      startTime: "15:00",
      endTime: "16:00",
      location: "Lab 112, Tech Block",
      attendanceMarked: false
    }
  ];

  const subjects = [
    {
      id: 1,
      name: "Data Structures & Algorithms",
      faculty: "Dr. Priya Sharma",
      present: 12,
      absent: 2,
      totalClasses: 14,
      attendancePercentage: 86,
      nextClass: {
        date: "Tomorrow",
        time: "09:00 AM",
        location: "Room 301"
      }
    },
    {
      id: 2,
      name: "Database Management Systems",
      faculty: "Prof. Rajesh Kumar",
      present: 10,
      absent: 3,
      totalClasses: 13,
      attendancePercentage: 77,
      nextClass: {
        date: "Today",
        time: "11:00 AM",
        location: "Lab 205"
      }
    },
    {
      id: 3,
      name: "Software Engineering",
      faculty: "Dr. Anita Verma",
      present: 8,
      absent: 4,
      totalClasses: 12,
      attendancePercentage: 67,
      nextClass: {
        date: "Today",
        time: "02:00 PM",
        location: "Room 102"
      }
    },
    {
      id: 4,
      name: "Computer Networks",
      faculty: "Prof. Suresh Patel",
      present: 11,
      absent: 1,
      totalClasses: 12,
      attendancePercentage: 92,
      nextClass: {
        date: "Monday",
        time: "10:00 AM",
        location: "Lab 301"
      }
    }
  ];

  const attendanceCalendarData = [
    { date: "2025-01-10", status: "present" },
    { date: "2025-01-11", status: "present" },
    { date: "2025-01-12", status: "absent" },
    { date: "2025-01-13", status: "present" },
    { date: "2025-01-14", status: "late" },
    { date: "2025-01-15", status: "present" },
    { date: "2025-01-16", status: "present" },
    { date: "2025-01-17", status: "absent" },
    { date: "2025-01-18", status: "present" }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "attendance_marked",
      title: "Attendance Marked",
      description: "Successfully marked attendance for Database Management Systems",
      subject: "DBMS",
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 2,
      type: "late_arrival",
      title: "Late Arrival Recorded",
      description: "Marked as late for Software Engineering class",
      subject: "SE",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 3,
      type: "attendance_missed",
      title: "Missed Class",
      description: "Absent from Computer Networks lecture",
      subject: "CN",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 4,
      type: "correction_requested",
      title: "Correction Requested",
      description: "Submitted attendance correction for yesterday\'s DSA class",
      subject: "DSA",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser?.role !== 'student') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-[4.5vw] bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <DashboardNavigation user={user} attendanceStats={attendanceStats} />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <AttendanceOverviewCard attendanceStats={attendanceStats} />
              <TodayClassesCard todayClasses={todayClasses} />
              <SubjectAttendanceCard subjects={subjects} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <QuickActionsCard user={user} />
              <AttendanceCalendarCard attendanceData={attendanceCalendarData} />
              <RecentActivityCard recentActivities={recentActivities} />
            </div>
          </div>

          {/* Bottom Section - Additional Info */}
          <div className="bg-card rounded-lg p-6 shadow-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Important Notices</h3>
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Low Attendance Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Your attendance in Software Engineering is below 75%. Please attend upcoming classes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Attendance Policy Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Minimum 75% attendance is required for semester examination eligibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;