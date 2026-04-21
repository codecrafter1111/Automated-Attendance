import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventRegistrationModal = ({ event, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen || !event) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <div className="bg-card rounded-lg shadow-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Event Registration</h2>
              <p className="text-sm text-muted-foreground mt-1">Confirm your registration</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Event Title */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Date
                </span>
                <span className="font-medium text-foreground">{event.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Icon name="Clock" size={16} className="mr-2" />
                  Time
                </span>
                <span className="font-medium text-foreground">{event.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  Location
                </span>
                <span className="font-medium text-foreground">{event.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Icon name="Users" size={16} className="mr-2" />
                  Capacity
                </span>
                <span className="font-medium text-foreground">
                  {event.registered}/{event.capacity}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <Icon name="Info" size={14} className="inline mr-2" />
                You will receive confirmation email after registration
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onConfirm}
              loading={isLoading}
            >
              <Icon name="Check" size={14} className="mr-2" />
              Confirm Registration
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventRegistrationModal;
