import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const AttendanceCalendar = ({ calendarData, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getAttendanceForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return calendarData?.find(item => item?.date === dateStr);
  };

  const getDateStatus = (date) => {
    const attendance = getAttendanceForDate(date);
    if (!attendance) return 'no-class';
    
    if (attendance?.status === 'present') return 'present';
    if (attendance?.status === 'absent') return 'absent';
    if (attendance?.status === 'late') return 'late';
    return 'no-class';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'absent': return 'bg-error text-error-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate?.getFullYear();
    const month = currentDate?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const handleDateClick = (date) => {
    if (date) {
      const attendance = getAttendanceForDate(date);
      onDateSelect(date, attendance);
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth();
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays?.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days?.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2 h-10" />;
          }
          
          const status = getDateStatus(date);
          const attendance = getAttendanceForDate(date);
          
          return (
            <button
              key={date?.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`p-2 h-10 text-sm rounded-md transition-smooth hover:bg-muted relative ${
                isToday(date) ? 'ring-2 ring-primary' : ''
              } ${getStatusColor(status)}`}
              title={attendance ? `${attendance?.subject} - ${attendance?.status}` : 'No class'}
            >
              {date?.getDate()}
              {attendance && (
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-current opacity-60" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const getMonthStats = () => {
    const year = currentDate?.getFullYear();
    const month = currentDate?.getMonth();
    const monthData = calendarData?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate?.getFullYear() === year && itemDate?.getMonth() === month;
    });

    const present = monthData?.filter(item => item?.status === 'present')?.length;
    const absent = monthData?.filter(item => item?.status === 'absent')?.length;
    const late = monthData?.filter(item => item?.status === 'late')?.length;
    const total = monthData?.length;

    return { present, absent, late, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  const monthStats = getMonthStats();

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Attendance Calendar</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
              iconName={viewMode === 'month' ? 'Calendar' : 'CalendarDays'}
              iconSize={16}
            >
              {viewMode === 'month' ? 'Week' : 'Month'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              iconName="ChevronLeft"
              iconSize={16}
            />
            <h4 className="text-xl font-semibold text-foreground">
              {months?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              iconName="ChevronRight"
              iconSize={16}
            />
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">{monthStats?.percentage}%</div>
            <div className="text-sm text-muted-foreground">This month</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {renderMonthView()}
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <span className="text-sm text-muted-foreground">Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">No Class</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {monthStats?.present}P / {monthStats?.absent}A / {monthStats?.late}L of {monthStats?.total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;