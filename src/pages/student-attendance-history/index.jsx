import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AttendanceStatsCards from './components/AttendanceStatsCards';
import AttendanceFilters from './components/AttendanceFilters';
import AttendanceTable from './components/AttendanceTable';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import AttendanceCalendar from './components/AttendanceCalendar';
import CorrectionRequestModal from './components/CorrectionRequestModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const StudentAttendanceHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('table');
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    subject: '',
    status: '',
    method: '',
    faculty: ''
  });
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // Mock attendance data
  const mockAttendanceRecords = [
    {
      id: 1,
      date: '2025-01-13',
      subject: 'Mathematics',
      classType: 'Lecture',
      faculty: 'Dr. Rajesh Kumar',
      status: 'present',
      method: 'qr',
      timestamp: '2025-01-13T09:15:00Z'
    },
    {
      id: 2,
      date: '2025-01-13',
      subject: 'Physics',
      classType: 'Lab',
      faculty: 'Prof. Priya Sharma',
      status: 'present',
      method: 'biometric',
      timestamp: '2025-01-13T11:30:00Z'
    },
    {
      id: 3,
      date: '2025-01-12',
      subject: 'Chemistry',
      classType: 'Lecture',
      faculty: 'Dr. Amit Patel',
      status: 'absent',
      method: 'manual',
      timestamp: '2025-01-12T14:00:00Z'
    },
    {
      id: 4,
      date: '2025-01-12',
      subject: 'Computer Science',
      classType: 'Practical',
      faculty: 'Ms. Sneha Gupta',
      status: 'late',
      method: 'facial',
      timestamp: '2025-01-12T10:45:00Z'
    },
    {
      id: 5,
      date: '2025-01-11',
      subject: 'English Literature',
      classType: 'Lecture',
      faculty: 'Prof. Sarah Johnson',
      status: 'present',
      method: 'qr',
      timestamp: '2025-01-11T13:15:00Z'
    },
    {
      id: 6,
      date: '2025-01-11',
      subject: 'Data Structures',
      classType: 'Lab',
      faculty: 'Dr. Vikram Singh',
      status: 'present',
      method: 'biometric',
      timestamp: '2025-01-11T15:30:00Z'
    },
    {
      id: 7,
      date: '2025-01-10',
      subject: 'Mathematics',
      classType: 'Tutorial',
      faculty: 'Dr. Rajesh Kumar',
      status: 'absent',
      method: 'manual',
      timestamp: '2025-01-10T11:00:00Z'
    },
    {
      id: 8,
      date: '2025-01-10',
      subject: 'Physics',
      classType: 'Lecture',
      faculty: 'Prof. Priya Sharma',
      status: 'present',
      method: 'qr',
      timestamp: '2025-01-10T09:30:00Z'
    }
  ];

  // Mock analytics data
  const mockAnalyticsData = {
    subjectWise: [
      { subject: 'Mathematics', percentage: 75, present: 15, total: 20, faculty: 'Dr. Rajesh Kumar' },
      { subject: 'Physics', percentage: 85, present: 17, total: 20, faculty: 'Prof. Priya Sharma' },
      { subject: 'Chemistry', percentage: 60, present: 12, total: 20, faculty: 'Dr. Amit Patel' },
      { subject: 'Computer Science', percentage: 90, present: 18, total: 20, faculty: 'Ms. Sneha Gupta' },
      { subject: 'English Literature', percentage: 80, present: 16, total: 20, faculty: 'Prof. Sarah Johnson' },
      { subject: 'Data Structures', percentage: 95, present: 19, total: 20, faculty: 'Dr. Vikram Singh' }
    ],
    monthlyTrends: [
      { month: 'Aug', percentage: 78 },
      { month: 'Sep', percentage: 82 },
      { month: 'Oct', percentage: 75 },
      { month: 'Nov', percentage: 88 },
      { month: 'Dec', percentage: 85 },
      { month: 'Jan', percentage: 80 }
    ],
    performanceDistribution: [
      { category: 'Excellent (90%+)', count: 2 },
      { category: 'Good (75-89%)', count: 2 },
      { category: 'Average (60-74%)', count: 1 },
      { category: 'Below Average (<60%)', count: 1 }
    ],
    dayWisePattern: [
      { day: 'Mon', attendance: 85 },
      { day: 'Tue', attendance: 78 },
      { day: 'Wed', attendance: 82 },
      { day: 'Thu', attendance: 88 },
      { day: 'Fri', attendance: 75 },
      { day: 'Sat', attendance: 70 }
    ],
    timeWisePattern: [
      { time: '9-10 AM', attendance: 90 },
      { time: '10-11 AM', attendance: 85 },
      { time: '11-12 PM', attendance: 80 },
      { time: '2-3 PM', attendance: 75 },
      { time: '3-4 PM', attendance: 70 }
    ],
    insights: [
      {
        type: 'positive',
        title: 'Strong Performance in Technical Subjects',
        description: 'Your attendance in Computer Science and Data Structures is excellent. Keep it up!'
      },
      {
        type: 'warning',
        title: 'Chemistry Attendance Needs Attention',
        description: 'Your Chemistry attendance is below the required 75%. Consider attending more classes.'
      },
      {
        type: 'info',
        title: 'Morning Classes Pattern',
        description: 'You have better attendance in morning classes. Try to maintain this pattern.'
      }
    ]
  };

  // Mock calendar data
  const mockCalendarData = mockAttendanceRecords?.map(record => ({
    date: record?.date,
    subject: record?.subject,
    status: record?.status
  }));

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Calculate stats
  const attendanceStats = useMemo(() => {
    const totalClasses = mockAttendanceRecords?.length;
    const totalPresent = mockAttendanceRecords?.filter(r => r?.status === 'present' || r?.status === 'late')?.length;
    const totalAbsent = mockAttendanceRecords?.filter(r => r?.status === 'absent')?.length;
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    
    const subjectsAtRisk = mockAnalyticsData?.subjectWise?.filter(s => s?.percentage < 75)?.length;
    
    const currentMonth = new Date()?.getMonth();
    const thisMonthRecords = mockAttendanceRecords?.filter(r => 
      new Date(r.date)?.getMonth() === currentMonth
    );
    const thisMonthClasses = thisMonthRecords?.length;
    const thisMonthPresent = thisMonthRecords?.filter(r => r?.status === 'present' || r?.status === 'late')?.length;
    
    const semesterPercentage = 82; // Mock semester percentage

    return {
      totalClasses,
      totalPresent,
      totalAbsent,
      overallPercentage,
      subjectsAtRisk,
      thisMonthClasses,
      thisMonthPresent,
      semesterPercentage
    };
  }, [mockAttendanceRecords]);

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = mockAttendanceRecords?.filter(record => {
      const matchesDateRange = (!filters?.fromDate || record?.date >= filters?.fromDate) &&
                              (!filters?.toDate || record?.date <= filters?.toDate);
      const matchesSubject = !filters?.subject || record?.subject?.toLowerCase()?.includes(filters?.subject?.toLowerCase());
      const matchesStatus = !filters?.status || record?.status === filters?.status;
      const matchesMethod = !filters?.method || record?.method === filters?.method;
      const matchesFaculty = !filters?.faculty || record?.faculty?.toLowerCase()?.includes(filters?.faculty?.toLowerCase());
      
      return matchesDateRange && matchesSubject && matchesStatus && matchesMethod && matchesFaculty;
    });

    // Sort records
    filtered?.sort((a, b) => {
      const aValue = a?.[sortConfig?.field];
      const bValue = b?.[sortConfig?.field];
      
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockAttendanceRecords, filters, sortConfig]);

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev?.field === field && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      subject: '',
      status: '',
      method: '',
      faculty: ''
    });
  };

  const handleRequestCorrection = (recordIds) => {
    setSelectedRecords(recordIds);
    setShowCorrectionModal(true);
  };

  const handleCorrectionSubmit = (correctionData) => {
    console.log('Correction request submitted:', correctionData);
    // In a real app, this would make an API call
    alert('Correction request submitted successfully! You will receive an email notification about the status.');
  };

  const handleDateSelect = (date, attendance) => {
    if (attendance) {
      console.log('Selected date:', date, 'Attendance:', attendance);
      // Could open a detailed view or filter by this date
    }
  };

  const viewTabs = [
    { id: 'table', label: 'Table View', icon: 'Table' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' }
  ];

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
    <div className="min-h-screen  bg-background">
      <HeaderNavigation user={user} />
      <BreadcrumbNavigation user={user} />
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center pt-[4.5vw] justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance History</h1>
              <p className="text-muted-foreground mt-2">
                Track your attendance records and analyze patterns across all subjects
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
                iconName="Download"
                iconSize={16}
              >
                Export Report
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/qr-code-scanner')}
                iconName="QrCode"
                iconSize={16}
              >
                Mark Attendance
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <AttendanceStatsCards stats={attendanceStats} />

          {/* View Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {viewTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveView(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    activeView === tab?.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active view */}
          {activeView === 'table' && (
            <div className="space-y-6">
              <AttendanceFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
              />
              <AttendanceTable
                records={filteredAndSortedRecords}
                onSort={handleSort}
                sortConfig={sortConfig}
                onRequestCorrection={handleRequestCorrection}
              />
            </div>
          )}

          {activeView === 'analytics' && (
            <AttendanceAnalytics analyticsData={mockAnalyticsData} />
          )}

          {activeView === 'calendar' && (
            <AttendanceCalendar
              calendarData={mockCalendarData}
              onDateSelect={handleDateSelect}
            />
          )}
        </div>
      </main>
      {/* Correction Request Modal */}
      <CorrectionRequestModal
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        selectedRecords={selectedRecords}
        onSubmit={handleCorrectionSubmit}
      />
    </div>
  );
};

export default StudentAttendanceHistory;