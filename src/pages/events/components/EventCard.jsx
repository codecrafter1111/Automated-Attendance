import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, userRole, isRegistered, onRegister, onUnregister, onShare, onEdit, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-700',
      career: 'bg-green-100 text-green-700',
      study: 'bg-orange-100 text-orange-700',
      upcoming: 'bg-purple-100 text-purple-700',
      workshop: 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600';
      case 'ongoing':
        return 'text-green-600';
      case 'completed':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const isEventFull = event.registered >= event.capacity;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header with Category Badge */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          <span className={`text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* Event Details */}
      <div className="px-6 py-3 space-y-3 border-t border-border bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} className="mr-2 flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Clock" size={16} className="mr-2 flex-shrink-0" />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} className="mr-2 flex-shrink-0" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Users" size={16} className="mr-2 flex-shrink-0" />
          <span>{event.registered}/{event.capacity} registered</span>
        </div>
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="px-6 py-3 border-t border-border flex flex-wrap gap-2">
          {event.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-border transition-colors"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{event.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
        {userRole === 'student' ? (
          <>
            <Button
              variant={isRegistered ? 'secondary' : 'default'}
              size="sm"
              onClick={() => isRegistered ? onUnregister(event.id) : onRegister(event.id)}
              disabled={!isRegistered && isEventFull}
              className="flex-1"
            >
              {isRegistered ? (
                <>
                  <Icon name="Check" size={14} className="mr-1" />
                  Registered
                </>
              ) : isEventFull ? (
                'Event Full'
              ) : (
                <>
                  <Icon name="Plus" size={14} className="mr-1" />
                  Register
                </>
              )}
            </Button>
            <button
              onClick={() => onShare(event)}
              className="p-2 rounded-md border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Share event"
            >
              <Icon name="Share2" size={16} />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-foreground">
              {event.registered}/{event.capacity}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10 w-32">
                  <button
                    onClick={() => {
                      onEdit(event);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Edit" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(event.id);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center space-x-2"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
