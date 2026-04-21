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
    <div className="bg-gradient-to-br from-card to-card/50 rounded-xl shadow-card border-2 border-border p-4 mb-4 hover:shadow-card-hover transition-all duration-300">
      {/* Header with selection info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <Checkbox
            checked={allSelected}
            onChange={onSelectAll}
            label="Select All"
            className="w-5 h-5 cursor-pointer"
          />
          {selectedCount > 0 && (
            <span className="text-sm font-semibold px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary">
              {selectedCount} / {totalCount} selected
            </span>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2 gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => onBulkActions('present')}
              iconName="Check"
              iconPosition="left"
              className="shadow-button"
            >
              Present
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onBulkActions('absent')}
              iconName="X"
              iconPosition="left"
              className="shadow-button"
            >
              Absent
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => onBulkActions('late')}
              iconName="Clock"
              iconPosition="left"
              className="shadow-button"
            >
              Late
            </Button>
          </div>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="🔍 Search students..."
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
          className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/50"
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
          className="px-4 py-2 border-2 border-border rounded-lg bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/50"
        >
          {sortOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Quick Stats */}
      <div className="pt-4 border-t-2 border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 rounded-lg hover:border-success/40 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Present</span>
            </div>
            <div className="text-lg font-bold text-success mt-1">{totalCount - selectedCount}</div>
          </div>
          
          <div className="p-3 bg-gradient-to-br from-error/10 to-error/5 border-2 border-error/20 rounded-lg hover:border-error/40 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-xs text-muted-foreground">Absent</span>
            </div>
            <div className="text-lg font-bold text-error mt-1">0</div>
          </div>
          
          <div className="p-3 bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 rounded-lg hover:border-warning/40 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs text-muted-foreground">Late</span>
            </div>
            <div className="text-lg font-bold text-warning mt-1">0</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary/40 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-lg font-bold text-primary mt-1">{totalCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListHeader;