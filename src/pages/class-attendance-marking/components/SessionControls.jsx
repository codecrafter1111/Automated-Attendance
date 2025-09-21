import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionControls = ({ 
  sessionActive, 
  onStartSession, 
  onEndSession, 
  onSaveAttendance,
  onSyncOfflineData,
  hasUnsavedChanges,
  isOfflineMode,
  lastSyncTime 
}) => {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Session Status */}
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              sessionActive ? 'bg-success animate-pulse' : 'bg-muted'
            }`}></div>
            <h3 className="text-lg font-semibold text-foreground">
              Session {sessionActive ? 'Active' : 'Inactive'}
            </h3>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {sessionActive && (
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span>Started: {new Date()?.toLocaleTimeString()}</span>
              </div>
            )}
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertCircle" size={14} />
                <span>Unsaved changes</span>
              </div>
            )}
            
            {isOfflineMode && lastSyncTime && (
              <div className="flex items-center space-x-2">
                <Icon name="WifiOff" size={14} />
                <span>Last sync: {new Date(lastSyncTime)?.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {isOfflineMode && (
            <Button
              variant="warning"
              onClick={onSyncOfflineData}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Sync Data
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onSaveAttendance}
            disabled={!hasUnsavedChanges}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
          
          {!sessionActive ? (
            <Button
              variant="success"
              onClick={onStartSession}
              iconName="Play"
              iconPosition="left"
            >
              Start Session
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={onEndSession}
              iconName="Square"
              iconPosition="left"
            >
              End Session
            </Button>
          )}
        </div>
      </div>
      {/* Session Summary */}
      {sessionActive && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success">24</div>
              <div className="text-xs text-muted-foreground">Present</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-error">3</div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">2</div>
              <div className="text-xs text-muted-foreground">Late</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">83%</div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
          </div>
        </div>
      )}
      {/* Grace Period Settings */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Late arrival grace period: 10 minutes</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={14}
          >
            Configure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionControls;