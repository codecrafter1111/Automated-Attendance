import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateEventModal = ({ event, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    tags: '',
    status: 'upcoming'
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'academic',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        capacity: event.capacity || 50,
        tags: event.tags?.join(', ') || '',
        status: event.status || 'upcoming'
      });
    }
  }, [event, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      capacity: parseInt(formData.capacity)
    };
    if (event?.id) {
      submitData.id = event.id;
    }
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="bg-card rounded-lg shadow-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-card">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {event?.id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {event?.id ? 'Update event details' : 'Add a new campus event'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Event Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="study">Study</option>
                  <option value="workshop">Workshop</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the event..."
                rows="3"
                required
                className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Date, Time & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time *
                </label>
                <Input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 14:00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Capacity *
                </label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event location"
                required
              />
            </div>

            {/* Tags & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., AI, Machine Learning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-border flex gap-3 justify-end sticky bottom-0 bg-card">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isLoading}
            >
              <Icon name="Save" size={14} className="mr-2" />
              {event?.id ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEventModal;
