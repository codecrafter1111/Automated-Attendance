import React from 'react';
import Icon from '../../../components/AppIcon';

const AssignmentFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterStatusChange, 
  filterSubject, 
  onFilterSubjectChange,
  subjects 
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search Bar */}
      <div className="w-full relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
        </div>

        <div className="flex-1 relative">
          <select
            value={filterSubject}
            onChange={(e) => onFilterSubjectChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
        </div>
      </div>
    </div>
  );
};

export default AssignmentFilters;
