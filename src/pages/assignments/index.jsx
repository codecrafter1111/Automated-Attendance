import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AssignmentStatsCards from './components/AssignmentStatsCards';
import AssignmentCard from './components/AssignmentCard';
import AssignmentFilters from './components/AssignmentFilters';
import SubmitAssignmentModal from './components/SubmitAssignmentModal';
import CreateAssignmentModal from './components/CreateAssignmentModal';
import ViewAssignmentDetailsModal from './components/ViewAssignmentDetailsModal';
import GradeSubmissionModal from './components/GradeSubmissionModal';

const Assignments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Modal States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedAssignmentToEdit, setSelectedAssignmentToEdit] = useState(null);

  // Loading States
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(false);

  // Mock Assignments Data
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Binary Tree Implementation',
      description: 'Implement a complete binary tree with insertion, deletion, and traversal methods',
      subject: 'Data Structures',
      instructor: 'Dr. Smith',
      points: 100,
      dueDate: '2024-01-30',
      dueTime: '23:59',
      lateSubmissionAllowed: true,
      status: 'pending',
      instructions: 'Implement the following methods:\n1. Insert\n2. Delete\n3. Inorder Traversal\n4. Preorder Traversal\n5. Postorder Traversal',
      grade: null,
      feedback: null
    },
    {
      id: 2,
      title: 'Database Design Project',
      description: 'Design and implement a relational database for a library management system',
      subject: 'Database Systems',
      instructor: 'Dr. Johnson',
      points: 150,
      dueDate: '2024-02-05',
      dueTime: '18:00',
      lateSubmissionAllowed: false,
      status: 'pending',
      instructions: 'Create ER diagram and implement SQL queries',
      grade: null,
      feedback: null
    },
    {
      id: 3,
      title: 'Web Development Project',
      description: 'Create a responsive web application using React',
      subject: 'Web Development',
      instructor: 'Prof. Williams',
      points: 200,
      dueDate: '2024-01-20',
      dueTime: '23:59',
      lateSubmissionAllowed: true,
      status: 'submitted',
      instructions: 'Build a complete web app with React, Redux, and Tailwind CSS',
      grade: null,
      feedback: null,
      submittedOn: '2024-01-15'
    },
    {
      id: 4,
      title: 'Algorithm Analysis Report',
      description: 'Analyze and compare different sorting algorithms',
      subject: 'Algorithms',
      instructor: 'Dr. Brown',
      points: 100,
      dueDate: '2024-01-15',
      dueTime: '23:59',
      lateSubmissionAllowed: false,
      status: 'graded',
      instructions: 'Compare time and space complexity',
      grade: 85,
      feedback: 'Excellent analysis! Great comparison tables and visualizations.'
    },
    {
      id: 5,
      title: 'System Design Challenge',
      description: 'Design a scalable system architecture',
      subject: 'System Design',
      instructor: 'Prof. Anderson',
      points: 120,
      dueDate: '2024-02-10',
      dueTime: '18:00',
      lateSubmissionAllowed: true,
      status: 'pending',
      instructions: 'Design a system to handle 1 million users',
      grade: null,
      feedback: null
    },
    {
      id: 6,
      title: 'Mobile App Development',
      description: 'Develop a mobile app using React Native',
      subject: 'Mobile Development',
      instructor: 'Dr. Taylor',
      points: 180,
      dueDate: '2024-02-28',
      dueTime: '23:59',
      lateSubmissionAllowed: true,
      status: 'pending',
      instructions: 'Create a fully functional mobile app',
      grade: null,
      feedback: null
    }
  ]);

  // Student Submissions
  const [studentSubmissions, setStudentSubmissions] = useState([]);

  // Get unique subjects
  const subjects = [...new Set(assignments.map(a => a.subject))];

  // Get User from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      // Load student submissions
      if (parsed.role === 'student') {
        const saved = localStorage.getItem(`student_submissions_${parsed.id}`);
        if (saved) {
          setStudentSubmissions(JSON.parse(saved));
        }
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Filter Assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Calculate Stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length
  };

  // Check if student submitted
  const isStudentSubmitted = (assignmentId) => {
    return studentSubmissions.includes(assignmentId);
  };

  // Handle Submit
  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  // Confirm Submission
  const handleConfirmSubmission = async (submissionData) => {
    setSubmittingAssignment(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStudentSubmissions(prev => [...prev, submissionData.assignmentId]);
    localStorage.setItem(
      `student_submissions_${user.id}`,
      JSON.stringify([...studentSubmissions, submissionData.assignmentId])
    );
    
    // Update assignment status
    setAssignments(prev => prev.map(a =>
      a.id === submissionData.assignmentId
        ? { ...a, status: 'submitted', submittedOn: new Date().toISOString() }
        : a
    ));
    
    setSubmittingAssignment(false);
    setShowSubmitModal(false);
    setSelectedAssignment(null);
  };

  // Handle View Details
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  // Handle Edit
  const handleEdit = (assignment) => {
    setSelectedAssignmentToEdit(assignment);
    setShowCreateModal(true);
  };

  // Handle Delete
  const handleDelete = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    }
  };

  // Handle Grade
  const handleGrade = (assignment) => {
    setSelectedAssignment(assignment);
    setShowGradeModal(true);
  };

  // Handle Save Assignment
  const handleSaveAssignment = async (formData) => {
    setCreatingAssignment(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (formData.id) {
      // Update existing
      setAssignments(prev => prev.map(a =>
        a.id === formData.id
          ? { ...a, ...formData }
          : a
      ));
    } else {
      // Create new
      const newAssignment = {
        ...formData,
        id: Math.max(...assignments.map(a => a.id), 0) + 1,
        status: 'pending',
        grade: null,
        feedback: null
      };
      setAssignments(prev => [...prev, newAssignment]);
    }
    
    setCreatingAssignment(false);
    setShowCreateModal(false);
    setSelectedAssignmentToEdit(null);
  };

  // Handle Grade Submission
  const handleGradeSubmission = async (gradeData) => {
    setGradingSubmission(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAssignments(prev => prev.map(a =>
      a.id === gradeData.assignmentId
        ? { ...a, status: 'graded', grade: gradeData.grade, feedback: gradeData.feedback }
        : a
    ));
    
    setGradingSubmission(false);
    setShowGradeModal(false);
    setSelectedAssignment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Assignments', path: '/assignments' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation user={user} />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <BreadcrumbNavigation items={breadcrumbs} />
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 mt-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user?.role === 'student' ? 'My Assignments' : 'Manage Assignments'}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === 'student' ? 'View and submit your assignments' : 'Create and manage student assignments'}
              </p>
            </div>
            
            {/* Create Button - Only for Faculty/Admin */}
            {user?.role !== 'student' && (
              <Button
                onClick={() => {
                  setSelectedAssignmentToEdit(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon name="Plus" size={18} />
                <span>Create Assignment</span>
              </Button>
            )}
          </div>

          {/* Stats Cards - Student Only */}
          {user?.role === 'student' && (
            <AssignmentStatsCards
              totalAssignments={stats.total}
              pending={stats.pending}
              submitted={stats.submitted}
              graded={stats.graded}
            />
          )}

          {/* Filters */}
          <AssignmentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            filterSubject={filterSubject}
            onFilterSubjectChange={setFilterSubject}
            subjects={subjects}
          />

          {/* Assignments Grid */}
          {filteredAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map(assignment => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  userRole={user?.role}
                  isSubmitted={user?.role === 'student' ? isStudentSubmitted(assignment.id) : false}
                  onSubmit={handleSubmit}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onGrade={handleGrade}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No assignments found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SubmitAssignmentModal
        assignment={selectedAssignment}
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSelectedAssignment(null);
        }}
        onSubmit={handleConfirmSubmission}
        isLoading={submittingAssignment}
      />

      {user?.role !== 'student' && (
        <CreateAssignmentModal
          assignment={selectedAssignmentToEdit}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedAssignmentToEdit(null);
          }}
          onSave={handleSaveAssignment}
          isLoading={creatingAssignment}
        />
      )}

      <ViewAssignmentDetailsModal
        assignment={selectedAssignment}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAssignment(null);
        }}
        userRole={user?.role}
      />

      {user?.role !== 'student' && (
        <GradeSubmissionModal
          assignment={selectedAssignment}
          isOpen={showGradeModal}
          onClose={() => {
            setShowGradeModal(false);
            setSelectedAssignment(null);
          }}
          onSave={handleGradeSubmission}
          isLoading={gradingSubmission}
        />
      )}
    </div>
  );
};

export default Assignments;
