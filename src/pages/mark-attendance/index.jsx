import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import {
  addAttendanceSubmission,
  getAttendanceSessions,
} from '../../utils/attendanceSessionStore';

const isWithinTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return true;

  const now = new Date();
  const start = new Date();
  const end = new Date();

  const [startHours, startMinutes] = String(startTime).split(':');
  const [endHours, endMinutes] = String(endTime).split(':');

  start.setHours(parseInt(startHours, 10) || 0, parseInt(startMinutes, 10) || 0, 0, 0);
  end.setHours(parseInt(endHours, 10) || 23, parseInt(endMinutes, 10) || 59, 0, 0);

  return now >= start && now <= end;
};

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const user = useMemo(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      return null;
    }
  }, []);

  const classId = searchParams.get('classId') || 'CLASS-12345';
  const className = searchParams.get('className') || 'Unknown Class';
  const sessionId = searchParams.get('sessionId') || '';
  const faculty = searchParams.get('faculty') || 'Faculty Name';
  const location = searchParams.get('location') || 'Room A-101';
  const expiresAt = Number(searchParams.get('expiresAt')) || 0;
  const classStartTime = searchParams.get('classStartTime') || '';
  const classEndTime = searchParams.get('classEndTime') || '';

  const session = useMemo(() => {
    if (!sessionId) return null;
    return getAttendanceSessions().find((item) => item.sessionId === sessionId) || null;
  }, [sessionId]);

  const effectiveExpiry = expiresAt || session?.expiresAt || 0;
  const isExpired = effectiveExpiry > 0 && Date.now() > effectiveExpiry;
  const hasClassWindow = Boolean(classStartTime && classEndTime);
  const isOutsideClassWindow = hasClassWindow && !isWithinTimeRange(classStartTime, classEndTime);

  useEffect(() => {
    if (!user) {
      const redirectPath = encodeURIComponent(`/mark-attendance?${searchParams.toString()}`);
      navigate(`/login?redirect=${redirectPath}`);
      return;
    }

    if (user.role !== 'student') {
      navigate('/faculty-dashboard');
    }
  }, [navigate, searchParams, user]);

  if (!user || user.role !== 'student') return null;

  const handleMarkAttendance = async () => {
    if (!sessionId || isExpired || isOutsideClassWindow) return;

    setIsSubmitting(true);

    const submission = {
      id: `att_${Math.random().toString(36).substring(2, 11)}`,
      sessionId,
      classId,
      className,
      faculty,
      location,
      status: 'present',
      method: 'qr',
      timestamp: Date.now(),
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
    };

    addAttendanceSubmission(submission);
    setIsSubmitted(true);

    setTimeout(() => {
      navigate('/student-dashboard');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation user={user} />

      <main className="pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="QrCode" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
                <p className="text-muted-foreground">Confirm attendance for this class session</p>
              </div>
            </div>

            <div className="space-y-3 bg-muted/20 border border-border rounded-lg p-4 mb-6">
              <p className="text-sm"><span className="font-semibold text-foreground">Class:</span> <span className="text-muted-foreground">{className}</span></p>
              <p className="text-sm"><span className="font-semibold text-foreground">Class ID:</span> <span className="text-muted-foreground">{classId}</span></p>
              <p className="text-sm"><span className="font-semibold text-foreground">Faculty:</span> <span className="text-muted-foreground">{faculty}</span></p>
              <p className="text-sm"><span className="font-semibold text-foreground">Location:</span> <span className="text-muted-foreground">{location}</span></p>
              <p className="text-sm"><span className="font-semibold text-foreground">Session:</span> <span className="text-muted-foreground">{sessionId || 'N/A'}</span></p>
              {hasClassWindow && (
                <p className="text-sm"><span className="font-semibold text-foreground">Class Window:</span> <span className="text-muted-foreground">{classStartTime} - {classEndTime}</span></p>
              )}
            </div>

            {!sessionId && (
              <div className="bg-error/10 border border-error/30 text-error rounded-lg p-4 mb-4 text-sm">
                Invalid QR code. Session information is missing.
              </div>
            )}

            {isExpired && (
              <div className="bg-warning/10 border border-warning/30 text-warning rounded-lg p-4 mb-4 text-sm">
                This attendance QR has expired. Ask your faculty to generate a new QR code.
              </div>
            )}

            {isOutsideClassWindow && (
              <div className="bg-warning/10 border border-warning/30 text-warning rounded-lg p-4 mb-4 text-sm">
                Attendance is allowed only during class time ({classStartTime} - {classEndTime}).
              </div>
            )}

            {isSubmitted ? (
              <div className="bg-success/10 border border-success/30 text-success rounded-lg p-4 text-sm flex items-center gap-2">
                <Icon name="CheckCircle" size={18} />
                Attendance marked successfully. Redirecting to Student Dashboard...
              </div>
            ) : (
              <Button
                variant="default"
                fullWidth
                onClick={handleMarkAttendance}
                disabled={!sessionId || isExpired || isOutsideClassWindow || isSubmitting}
                loading={isSubmitting}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Mark Present
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarkAttendance;
