import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AttendanceFilters = ({ filters, onFilterChange, onReset }) => {
  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'english', label: 'English Literature' },
    { value: 'data-structures', label: 'Data Structures' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' }
  ];

  const methodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'qr', label: 'QR Code' },
    { value: 'biometric', label: 'Biometric' },
    { value: 'facial', label: 'Facial Recognition' },
    { value: 'manual', label: 'Manual Entry' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Attendance Records</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          iconName="RotateCcw"
          iconSize={16}
        >
          Reset Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <Input
            label="From Date"
            type="date"
            value={filters?.fromDate}
            onChange={(e) => handleInputChange('fromDate', e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="xl:col-span-2">
          <Input
            label="To Date"
            type="date"
            value={filters?.toDate}
            onChange={(e) => handleInputChange('toDate', e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="xl:col-span-2">
          <Select
            label="Subject"
            options={subjectOptions}
            value={filters?.subject}
            onChange={(value) => handleInputChange('subject', value)}
            placeholder="Select subject"
          />
        </div>
        
        <div className="xl:col-span-2">
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Select status"
          />
        </div>
        
        <div className="xl:col-span-2">
          <Select
            label="Method"
            options={methodOptions}
            value={filters?.method}
            onChange={(value) => handleInputChange('method', value)}
            placeholder="Select method"
          />
        </div>
        
        <div className="xl:col-span-2">
          <Input
            label="Faculty"
            type="text"
            placeholder="Search faculty name"
            value={filters?.faculty}
            onChange={(e) => handleInputChange('faculty', e?.target?.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;