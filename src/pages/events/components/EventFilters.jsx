import React from 'react';
import Icon from '../../../components/AppIcon';

const EventFilters = ({ searchTerm, onSearchChange, filterStatus, onFilterChange, eventCategories }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      {/* Search Bar */}
      <div className="w-full md:w-96 relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter Dropdown */}
      <div className="w-full md:w-48 relative">
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
      </div>
    </div>
  );
};

export default EventFilters;
