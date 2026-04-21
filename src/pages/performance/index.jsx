import React, { useState } from 'react';
import HeaderNavigation from 'components/ui/HeaderNavigation';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import PerformanceStatsCards from './components/PerformanceStatsCards';
import PerformanceTrends from './components/PerformanceTrends';
import AttendanceBreakdown from './components/AttendanceBreakdown';
import SubjectPerformance from './components/SubjectPerformance';
import RecentAchievements from './components/RecentAchievements';
import UpcomingDeadlines from './components/UpcomingDeadlines';

const Performance = () => {
  const [semester, setSemester] = useState('current');
  const [subject, setSubject] = useState('all');

  // Mock data for stats
  const statsData = [
    {
      label: 'Overall GPA',
      value: '3.7',
      description: '+0.2 from last semester',
      icon: 'Award',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      trend: '+0.2',
      trendIcon: 'TrendingUp',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Attendance Rate',
      value: '86%',
      description: 'Above class average',
      icon: 'CheckCircle',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+3%',
      trendIcon: 'TrendingUp',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Assignment Score',
      value: '90%',
      description: '59/65 completed',
      icon: 'CheckCircle2',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: '+5%',
      trendIcon: 'TrendingUp',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Class Rank',
      value: '8th',
      description: 'out of 45 students',
      icon: 'Flame',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trend: '+1',
      trendIcon: 'TrendingUp',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  // Mock performance trends data
  const trendsData = [
    { month: 'Aug', value: 75 },
    { month: 'Sep', value: 78 },
    { month: 'Oct', value: 82 },
    { month: 'Nov', value: 85 },
    { month: 'Dec', value: 88 },
    { month: 'Jan', value: 90 }
  ];

  // Mock attendance breakdown
  const attendanceData = [
    {
      label: 'Present',
      percentage: 85,
      count: '63 days',
      color: '#10b981'
    },
    {
      label: 'Late',
      percentage: 8,
      count: '6 days',
      color: '#f59e0b'
    },
    {
      label: 'Absent',
      percentage: 7,
      count: '5 days',
      color: '#ef4444'
    }
  ];

  // Mock subject performance
  const subjectsData = [
    {
      subject: 'Data Structures',
      instructor: 'Dr. Smith',
      attendance: 85,
      assignments: '18/20',
      grade: 'A-',
      trend: 'up',
      lastClass: '2024-01-15'
    },
    {
      subject: 'Database Systems',
      instructor: 'Dr. Johnson',
      attendance: 92,
      assignments: '15/15',
      grade: 'A',
      trend: 'up',
      lastClass: '2024-01-14'
    },
    {
      subject: 'Software Engineering',
      instructor: 'Dr. Brown',
      attendance: 78,
      assignments: '12/16',
      grade: 'B+',
      trend: 'down',
      lastClass: '2024-01-13'
    },
    {
      subject: 'Computer Networks',
      instructor: 'Dr. Wilson',
      attendance: 88,
      assignments: '14/16',
      grade: 'A-',
      trend: 'up',
      lastClass: '2024-01-12'
    }
  ];

  // Mock achievements
  const achievementsData = [
    {
      title: 'Perfect Attendance Week',
      description: 'Attended all classes for 5 consecutive days',
      type: 'attendance',
      badge: 'attendance',
      date: '2024-01-10'
    },
    {
      title: 'Top Performer',
      description: 'Highest score in Database Systems midterm',
      type: 'academic',
      badge: 'academic',
      date: '2024-01-05'
    },
    {
      title: 'Consistent Learner',
      description: 'Maintained 90%+ attendance for 3 months',
      type: 'performance',
      badge: 'attendance',
      date: '2024-01-01'
    }
  ];

  // Mock deadlines
  const deadlinesData = [
    {
      title: 'Data Structures Assignment 3',
      subject: 'Data Structures',
      priority: 'high',
      dueDate: '2024-01-20'
    },
    {
      title: 'Database Project Phase 2',
      subject: 'Database Systems',
      priority: 'medium',
      dueDate: '2024-01-22'
    },
    {
      title: 'Software Engineering Quiz',
      subject: 'Software Engineering',
      priority: 'low',
      dueDate: '2024-01-25'
    }
  ];

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'John Doe',
    studentId: 'CS2021001',
    role: 'student'
  };

  const handleExport = () => {
    alert('Exporting performance report as PDF...');
    // Export functionality would go here
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors">
      {/* Header */}
      <HeaderNavigation />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Academic Performance
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive view of your academic progress
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-[#1B1B1B] hover:shadow-lg dark:hover:shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Icon name="Download" size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-[#1A1A1A] hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="current">This Semester</option>
                <option value="previous">Previous Semester</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-[#1A1A1A] hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="all">All Subjects</option>
                <option value="ds">Data Structures</option>
                <option value="db">Database Systems</option>
                <option value="se">Software Engineering</option>
                <option value="cn">Computer Networks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <PerformanceStatsCards stats={statsData} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceTrends data={trendsData} />
          <AttendanceBreakdown data={attendanceData} />
        </div>

        {/* Subject Performance Table */}
        <div className="mb-6">
          <SubjectPerformance subjects={subjectsData} />
        </div>

        {/* Achievements and Deadlines Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAchievements achievements={achievementsData} />
          <UpcomingDeadlines deadlines={deadlinesData} />
        </div>
      </div>
    </div>
  );
};

export default Performance;
