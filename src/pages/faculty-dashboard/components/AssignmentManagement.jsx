import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Data Structures Quiz",
      subject: "CS301",
      class: "Data Structures and Algorithms",
      dueDate: "2025-01-20",
      status: "active",
      submissionsCount: 23,
      totalStudents: 45,
      type: "quiz",
      createdAt: "2025-01-13"
    },
    {
      id: 2,
      title: "Database Design Project",
      subject: "CS302",
      class: "Database Management Systems",
      dueDate: "2025-01-25",
      status: "active",
      submissionsCount: 15,
      totalStudents: 38,
      type: "project",
      createdAt: "2025-01-10"
    },
    {
      id: 3,
      title: "Software Engineering Essay",
      subject: "CS303",
      class: "Software Engineering",
      dueDate: "2025-01-15",
      status: "overdue",
      submissionsCount: 35,
      totalStudents: 42,
      type: "essay",
      createdAt: "2025-01-05"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    type: 'assignment',
    instructions: '',
    maxMarks: 100
  });

  const classes = [
    { id: 'CS301', name: 'Data Structures and Algorithms', students: 45 },
    { id: 'CS302', name: 'Database Management Systems', students: 38 },
    { id: 'CS303', name: 'Software Engineering', students: 42 },
    { id: 'CS304', name: 'Computer Networks', students: 35 }
  ];

  const assignmentTypes = [
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'project', label: 'Project' },
    { value: 'essay', label: 'Essay' },
    { value: 'lab', label: 'Lab Work' }
  ];

  const filteredAssignments = assignments?.filter(assignment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return assignment?.status === 'active';
    if (activeTab === 'overdue') return assignment?.status === 'overdue';
    if (activeTab === 'completed') return assignment?.status === 'completed';
    return true;
  });

  const handleCreateAssignment = () => {
    if (!newAssignment?.title || !newAssignment?.subject || !newAssignment?.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedClass = classes?.find(c => c?.id === newAssignment?.subject);
    const assignment = {
      id: Date.now(),
      ...newAssignment,
      class: selectedClass?.name,
      status: 'active',
      submissionsCount: 0,
      totalStudents: selectedClass?.students,
      createdAt: new Date()?.toISOString()?.split('T')?.[0]
    };

    setAssignments([assignment, ...assignments]);
    setNewAssignment({
      title: '',
      description: '',
      subject: '',
      class: '',
      dueDate: '',
      type: 'assignment',
      instructions: '',
      maxMarks: 100
    });
    setShowCreateModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'completed': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz': return 'HelpCircle';
      case 'project': return 'Folder';
      case 'essay': return 'FileText';
      case 'lab': return 'FlaskConical';
      default: return 'BookOpen';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Assignment Management</h2>
          <p className="text-sm text-muted-foreground">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} iconName="Plus">
          Create Assignment
        </Button>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', count: assignments?.length },
          { key: 'active', label: 'Active', count: assignments?.filter(a => a?.status === 'active')?.length },
          { key: 'overdue', label: 'Overdue', count: assignments?.filter(a => a?.status === 'overdue')?.length }
        ]?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setActiveTab(tab?.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-smooth ${
              activeTab === tab?.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab?.label} ({tab?.count})
          </button>
        ))}
      </div>
      {/* Assignment Cards */}
      <div className="grid gap-4">
        {filteredAssignments?.map((assignment) => (
          <div key={assignment?.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-sm transition-smooth">
            <div className="flex items-start justify-between">
              <div className="flex space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10`}>
                  <Icon name={getTypeIcon(assignment?.type)} size={24} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {assignment?.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment?.status)}`}>
                      {assignment?.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center space-x-1">
                      <Icon name="BookOpen" size={14} />
                      <span>{assignment?.subject} • {assignment?.class}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Due: {new Date(assignment?.dueDate)?.toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Created: {new Date(assignment?.createdAt)?.toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {assignment?.submissionsCount}/{assignment?.totalStudents} submitted
                      </span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-smooth"
                        style={{ 
                          width: `${(assignment?.submissionsCount / assignment?.totalStudents) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {Math.round((assignment?.submissionsCount / assignment?.totalStudents) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm" iconName="Eye">
                  View
                </Button>
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" iconName="MoreVertical" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredAssignments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No assignments found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === 'all' ?'Create your first assignment to get started' 
              : `No ${activeTab} assignments at the moment`
            }
          </p>
          <Button onClick={() => setShowCreateModal(true)} iconName="Plus">
            Create Assignment
          </Button>
        </div>
      )}
      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-card rounded-lg shadow-modal border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Create New Assignment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted rounded-md transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      value={newAssignment?.title}
                      onChange={(e) => setNewAssignment({...newAssignment, title: e?.target?.value})}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter assignment title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Assignment Type
                    </label>
                    <select
                      value={newAssignment?.type}
                      onChange={(e) => setNewAssignment({...newAssignment, type: e?.target?.value})}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {assignmentTypes?.map((type) => (
                        <option key={type?.value} value={type?.value}>{type?.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Class/Subject *
                    </label>
                    <select
                      value={newAssignment?.subject}
                      onChange={(e) => setNewAssignment({...newAssignment, subject: e?.target?.value})}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a class</option>
                      {classes?.map((cls) => (
                        <option key={cls?.id} value={cls?.id}>
                          {cls?.id} - {cls?.name} ({cls?.students} students)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newAssignment?.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e?.target?.value})}
                      min={new Date()?.toISOString()?.split('T')?.[0]}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={newAssignment?.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e?.target?.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Brief description of the assignment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={newAssignment?.instructions}
                    onChange={(e) => setNewAssignment({...newAssignment, instructions: e?.target?.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Detailed instructions for students"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={newAssignment?.maxMarks}
                    onChange={(e) => setNewAssignment({...newAssignment, maxMarks: parseInt(e?.target?.value)})}
                    min="1"
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAssignment} iconName="Save">
                Create Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;