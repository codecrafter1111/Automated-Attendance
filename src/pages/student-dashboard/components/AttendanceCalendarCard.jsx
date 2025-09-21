import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const AttendanceCalendarCard = ({ attendanceData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const getAttendanceForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return attendanceData?.find(item => item?.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate?.setMonth(prev?.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days?.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const attendance = getAttendanceForDate(date);
      const isToday = date?.toDateString() === new Date()?.toDateString();
      const isPast = date < new Date()?.setHours(0, 0, 0, 0);

      days?.push(
        <div
          key={day}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium relative ${
            isToday ? 'ring-2 ring-primary' : ''
          } ${
            attendance?.status === 'present' ? 'bg-success text-success-foreground' :
            attendance?.status === 'absent' ? 'bg-error text-error-foreground' :
            attendance?.status === 'late' ? 'bg-warning text-warning-foreground' :
            isPast ? 'text-muted-foreground' : 'text-foreground hover:bg-muted'
          }`}
        >
          {day}
          {attendance && (
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current opacity-60" />
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
            iconSize={16}
          />
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
            iconSize={16}
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays?.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full" />
          <span className="text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded-full" />
          <span className="text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full" />
          <span className="text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendarCard;