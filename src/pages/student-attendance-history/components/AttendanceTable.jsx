import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceTable = ({ records, onSort, sortConfig, onRequestCorrection }) => {
  const [selectedRecords, setSelectedRecords] = useState([]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      absent: { color: 'bg-error text-error-foreground', icon: 'XCircle' },
      late: { color: 'bg-warning text-warning-foreground', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.absent;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      qr: { color: 'bg-primary text-primary-foreground', icon: 'QrCode', label: 'QR Code' },
      biometric: { color: 'bg-secondary text-secondary-foreground', icon: 'Fingerprint', label: 'Biometric' },
      facial: { color: 'bg-accent text-accent-foreground', icon: 'Camera', label: 'Facial' },
      manual: { color: 'bg-muted text-muted-foreground', icon: 'Edit', label: 'Manual' }
    };

    const config = methodConfig?.[method] || methodConfig?.manual;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </span>
    );
  };

  const handleSort = (field) => {
    onSort(field);
  };

  const getSortIcon = (field) => {
    if (sortConfig?.field !== field) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleRecordSelection = (recordId) => {
    setSelectedRecords(prev => 
      prev?.includes(recordId) 
        ? prev?.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRecords(prev => 
      prev?.length === records?.length ? [] : records?.map(r => r?.id)
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Attendance Records</h3>
          <div className="flex items-center space-x-2">
            {selectedRecords?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRequestCorrection(selectedRecords)}
                iconName="AlertCircle"
                iconSize={16}
              >
                Request Correction ({selectedRecords?.length})
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              {records?.length} records
            </span>
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRecords?.length === records?.length && records?.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
              {[
                { field: 'date', label: 'Date' },
                { field: 'subject', label: 'Subject' },
                { field: 'faculty', label: 'Faculty' },
                { field: 'status', label: 'Status' },
                { field: 'method', label: 'Method' },
                { field: 'timestamp', label: 'Time' }
              ]?.map(({ field, label }) => (
                <th key={field} className="p-4 text-left">
                  <button
                    onClick={() => handleSort(field)}
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <span>{label}</span>
                    <Icon name={getSortIcon(field)} size={14} />
                  </button>
                </th>
              ))}
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((record) => (
              <tr key={record?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRecords?.includes(record?.id)}
                    onChange={() => toggleRecordSelection(record?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4 text-sm text-foreground">
                  {formatDate(record?.date)}
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{record?.subject}</div>
                    <div className="text-xs text-muted-foreground">{record?.classType}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground">
                  {record?.faculty}
                </td>
                <td className="p-4">
                  {getStatusBadge(record?.status)}
                </td>
                <td className="p-4">
                  {getMethodBadge(record?.method)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatTime(record?.timestamp)}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRequestCorrection([record?.id])}
                    iconName="Edit"
                    iconSize={14}
                  >
                    Correct
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {records?.map((record) => (
          <div key={record?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRecords?.includes(record?.id)}
                  onChange={() => toggleRecordSelection(record?.id)}
                  className="rounded border-border"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{record?.subject}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(record?.date)}</div>
                </div>
              </div>
              {getStatusBadge(record?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Faculty:</span>
                <div className="font-medium text-foreground">{record?.faculty}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <div className="font-medium text-foreground">{formatTime(record?.timestamp)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Method:</span>
                <div className="mt-1">{getMethodBadge(record?.method)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <div className="font-medium text-foreground">{record?.classType}</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => onRequestCorrection([record?.id])}
                iconName="Edit"
                iconSize={14}
              >
                Request Correction
              </Button>
            </div>
          </div>
        ))}
      </div>
      {records?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
          <p className="text-muted-foreground">
            No attendance records match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;