import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const StudentListHeader = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange,
  sortBy,
  onSortChange,
  allSelected,
  onSelectAll,
  selectedCount,
  totalCount,
  onBulkActions
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Students' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rollNumber', label: 'Roll Number' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-4 mb-4">
      {/* Header with selection info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <Checkbox
            checked={allSelected}
            onChange={onSelectAll}
            label="Select All"
          />
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedCount} of {totalCount} selected
            </span>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => onBulkActions('present')}
              iconName="Check"
              iconPosition="left"
            >
              Mark Present
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkActions('absent')}
              iconName="X"
              iconPosition="left"
            >
              Mark Absent
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => onBulkActions('late')}
              iconName="Clock"
              iconPosition="left"
            >
              Mark Late
            </Button>
          </div>
        )}
      </div>
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {filterOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {sortOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              Sort by {option?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Present: {totalCount - selectedCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Absent: 0</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Late: 0</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Total: {totalCount} students
        </div>
      </div>
    </div>
  );
};

export default StudentListHeader;