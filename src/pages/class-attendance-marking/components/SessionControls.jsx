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
    <div className="bg-gradient-to-br from-card to-card/50 rounded-xl shadow-card border-2 border-border p-6 hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Session Status */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`relative w-4 h-4 rounded-full ${
              sessionActive ? 'bg-gradient-to-br from-success to-success/60 shadow-lg shadow-success/50 animate-pulse' : 'bg-muted'
            }`}>
              {sessionActive && <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75"></div>}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {sessionActive ? '🟢 Session Active' : '⚪ Session Inactive'}
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm">
            {sessionActive && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full text-success font-medium">
                <Icon name="Clock" size={14} />
                <span>Started: {new Date()?.toLocaleTimeString()}</span>
              </div>
            )}
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full text-warning font-medium animate-pulse">
                <Icon name="AlertCircle" size={14} />
                <span>⚠️ Unsaved changes</span>
              </div>
            )}
            
            {isOfflineMode && lastSyncTime && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium">
                <Icon name="WifiOff" size={14} />
                <span>Last sync: {new Date(lastSyncTime)?.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isOfflineMode && (
            <Button
              variant="warning"
              size="sm"
              onClick={onSyncOfflineData}
              iconName="RefreshCw"
              iconPosition="left"
              className="shadow-button"
            >
              Sync Data
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAttendance}
            disabled={!hasUnsavedChanges}
            iconName="Save"
            iconPosition="left"
            className="hover:border-primary hover:text-primary"
          >
            Save
          </Button>
          
          {!sessionActive ? (
            <Button
              variant="success"
              size="sm"
              onClick={onStartSession}
              iconName="Play"
              iconPosition="left"
              className="shadow-button"
            >
              Start
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={onEndSession}
              iconName="Square"
              iconPosition="left"
              className="shadow-button"
            >
              End
            </Button>
          )}
        </div>
      </div>
      
      {/* Session Summary */}
      {sessionActive && (
        <div className="mt-6 pt-6 border-t-2 border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 rounded-lg hover:border-success/40 transition-colors text-center hover:shadow-card">
              <div className="text-2xl font-bold text-success">24</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">✓ Present</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-error/10 to-error/5 border-2 border-error/20 rounded-lg hover:border-error/40 transition-colors text-center hover:shadow-card">
              <div className="text-2xl font-bold text-error">3</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">✕ Absent</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 rounded-lg hover:border-warning/40 transition-colors text-center hover:shadow-card">
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">⏱️ Late</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary/40 transition-colors text-center hover:shadow-card">
              <div className="text-2xl font-bold text-primary">83%</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">📊 Rate</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Grace Period Settings */}
      <div className="mt-6 pt-6 border-t-2 border-border">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10 rounded-lg hover:border-primary/20 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={18} className="text-primary" />
            </div>
            <span className="text-sm text-foreground font-medium">Late arrival grace period: <span className="font-bold text-primary">10 minutes</span></span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={14}
            className="hover:bg-primary/10"
          >
            Adjust
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionControls;