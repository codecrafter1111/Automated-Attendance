import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventRegistrationModal from './components/EventRegistrationModal';
import CreateEventModal from './components/CreateEventModal';

const Events = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal States
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  
  // Loading States
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  
  // Mock Events Data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Computer Science Symposium 2024',
      description: 'Annual symposium featuring latest research in AI, ML, and cybersecurity',
      category: 'academic',
      date: '2024-02-15',
      time: '09:00',
      location: 'Main Auditorium',
      capacity: 200,
      registered: 156,
      status: 'upcoming',
      tags: ['AI', 'Machine Learning', 'Research']
    },
    {
      id: 2,
      title: 'Career Fair - Tech Companies',
      description: 'Meet recruiters from top tech companies. Bring your resume!',
      category: 'career',
      date: '2024-02-20',
      time: '10:00',
      location: 'Student Center',
      capacity: 500,
      registered: 342,
      status: 'upcoming',
      tags: ['Career', 'Technology', 'Networking']
    },
    {
      id: 3,
      title: 'Study Group - Database Systems',
      description: 'Collaborative study session for upcoming midterm exam',
      category: 'study',
      date: '2024-01-25',
      time: '14:00',
      location: 'Library Room 301',
      capacity: 20,
      registered: 15,
      status: 'upcoming',
      tags: ['Study', 'Database', 'Midterm']
    },
    {
      id: 4,
      title: 'Web Development Workshop',
      description: 'Learn React, Node.js, and MongoDB with industry experts',
      category: 'workshop',
      date: '2024-02-10',
      time: '11:00',
      location: 'Tech Lab 205',
      capacity: 40,
      registered: 38,
      status: 'ongoing',
      tags: ['React', 'Web Development', 'Workshop']
    },
    {
      id: 5,
      title: 'AI & Ethics Discussion Panel',
      description: 'Discussion on ethical implications of AI development',
      category: 'academic',
      date: '2024-02-25',
      time: '15:30',
      location: 'Auditorium 1',
      capacity: 150,
      registered: 87,
      status: 'upcoming',
      tags: ['AI', 'Ethics', 'Discussion']
    },
    {
      id: 6,
      title: 'Campus Cleanup Drive',
      description: 'Join us for a community service event',
      category: 'upcoming',
      date: '2024-03-01',
      time: '08:00',
      location: 'Campus Grounds',
      capacity: 100,
      registered: 45,
      status: 'upcoming',
      tags: ['Community', 'Service']
    }
  ]);

  // Student Registrations
  const [studentRegistrations, setStudentRegistrations] = useState([]);

  // Get User from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      // Load student registrations
      if (parsed.role === 'student') {
        const saved = localStorage.getItem(`student_registrations_${parsed.id}`);
        if (saved) {
          setStudentRegistrations(JSON.parse(saved));
        }
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Filter Events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Check if student is registered
  const isStudentRegistered = (eventId) => {
    return studentRegistrations.includes(eventId);
  };

  // Handle Registration
  const handleRegister = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowRegistrationModal(true);
    }
  };

  // Confirm Registration
  const handleConfirmRegistration = async () => {
    setRegisteringEventId(selectedEvent.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStudentRegistrations(prev => [...prev, selectedEvent.id]);
    localStorage.setItem(
      `student_registrations_${user.id}`,
      JSON.stringify([...studentRegistrations, selectedEvent.id])
    );
    
    // Update event registration count
    setEvents(prev => prev.map(e => 
      e.id === selectedEvent.id 
        ? { ...e, registered: e.registered + 1 }
        : e
    ));
    
    setRegisteringEventId(null);
    setShowRegistrationModal(false);
    setSelectedEvent(null);
  };

  // Handle Unregister
  const handleUnregister = (eventId) => {
    setStudentRegistrations(prev => prev.filter(id => id !== eventId));
    localStorage.setItem(
      `student_registrations_${user.id}`,
      JSON.stringify(studentRegistrations.filter(id => id !== eventId))
    );
    
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, registered: Math.max(0, e.registered - 1) }
        : e
    ));
  };

  // Handle Share
  const handleShare = (event) => {
    const shareText = `Check out this event: ${event.title} on ${event.date} at ${event.location}`;
    if (navigator.share) {
      navigator.share({
        title: 'Campus Events',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Event details copied to clipboard!');
    }
  };

  // Handle Edit
  const handleEdit = (event) => {
    setSelectedEventToEdit(event);
    setShowCreateModal(true);
  };

  // Handle Delete
  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  // Handle Save Event (Create/Update)
  const handleSaveEvent = async (formData) => {
    setCreatingEvent(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (formData.id) {
      // Update existing event
      setEvents(prev => prev.map(e =>
        e.id === formData.id
          ? { ...formData, registered: e.registered }
          : e
      ));
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: Math.max(...events.map(e => e.id), 0) + 1,
        registered: 0
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setCreatingEvent(false);
    setShowCreateModal(false);
    setSelectedEventToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Icon name="Loader" size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation user={user} />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <BreadcrumbNavigation items={breadcrumbs} />
          
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Campus Events</h1>
              <p className="text-muted-foreground">Discover and participate in campus activities</p>
            </div>
            
            {/* Create Event Button - Only for Faculty/Admin */}
            {user?.role !== 'student' && (
              <Button
                onClick={() => {
                  setSelectedEventToEdit(null);
                  setShowCreateModal(true);
                }}
                // iconName="Plus"
                className="flex items-center space-x-2"
              >
                <Icon name="Plus" size={18} />
                <span>Create Event</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <EventFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  userRole={user?.role}
                  isRegistered={isStudentRegistered(event.id)}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  onShare={handleShare}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleConfirmRegistration}
        isLoading={registeringEventId === selectedEvent?.id}
      />

      {user?.role !== 'student' && (
        <CreateEventModal
          event={selectedEventToEdit}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedEventToEdit(null);
          }}
          onSave={handleSaveEvent}
          isLoading={creatingEvent}
        />
      )}
    </div>
  );
};

export default Events;
