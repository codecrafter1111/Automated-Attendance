import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CorrectionRequestModal = ({ isOpen, onClose, selectedRecords, onSubmit }) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    evidence: null,
    requestType: 'attendance_correction'
  });

  const reasonOptions = [
    { value: 'technical_issue', label: 'Technical Issue with Scanner' },
    { value: 'late_entry', label: 'Late Entry to Class' },
    { value: 'medical_emergency', label: 'Medical Emergency' },
    { value: 'system_error', label: 'System Error' },
    { value: 'proxy_issue', label: 'Proxy Attendance Issue' },
    { value: 'other', label: 'Other Reason' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    setFormData(prev => ({ ...prev, evidence: file }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit({
      ...formData,
      recordIds: selectedRecords,
      timestamp: new Date()?.toISOString()
    });
    setFormData({
      reason: '',
      description: '',
      evidence: null,
      requestType: 'attendance_correction'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-modal border border-border w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Request Attendance Correction</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Submit a request to correct attendance for {selectedRecords?.length} record(s)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Select
            label="Reason for Correction"
            options={reasonOptions}
            value={formData?.reason}
            onChange={(value) => handleInputChange('reason', value)}
            placeholder="Select a reason"
            required
          />

          <Input
            label="Detailed Description"
            type="text"
            placeholder="Provide detailed explanation for the correction request"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            required
            description="Explain the circumstances that led to the attendance discrepancy"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Supporting Evidence (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <input
                type="file"
                id="evidence"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="evidence"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Icon name="Upload" size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload supporting documents
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, PDF, DOC up to 5MB
                </span>
              </label>
              {formData?.evidence && (
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <Icon name="File" size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{formData?.evidence?.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('evidence', null)}
                    iconName="X"
                    iconSize={14}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Important Notes</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Correction requests are reviewed within 24-48 hours</li>
                  <li>• Provide accurate information to avoid delays</li>
                  <li>• Supporting evidence increases approval chances</li>
                  <li>• You'll receive email notification about the status</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={!formData?.reason || !formData?.description}
              iconName="Send"
              iconPosition="left"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorrectionRequestModal;