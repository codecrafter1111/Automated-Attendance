const ATTENDANCE_SESSIONS_KEY = 'attendease_active_attendance_sessions';
const ATTENDANCE_SUBMISSIONS_KEY = 'attendease_attendance_submissions';

const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const isBrowser = typeof window !== 'undefined';

const syncToMongo = async (submission) => {
  if (!isBrowser) return;

  try {
    const { saveAttendanceToMongo } = await import('./attendanceApi');
    await saveAttendanceToMongo(submission);
  } catch (error) {
    console.error('MongoDB sync skipped:', error);
  }
};

export const mergeRemoteAttendanceSubmissions = (remoteSubmissions = []) => {
  if (!isBrowser || !Array.isArray(remoteSubmissions)) return [];

  const localSubmissions = getAttendanceSubmissions();
  const combined = [...remoteSubmissions, ...localSubmissions];
  const deduped = [];
  const seen = new Set();

  combined.forEach((submission) => {
    const key = [
      submission?.classId || '',
      submission?.sessionId || '',
      submission?.studentId || '',
      submission?.studentName || '',
      submission?.timestamp || '',
    ].join('::');

    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(submission);
  });

  localStorage.setItem(ATTENDANCE_SUBMISSIONS_KEY, JSON.stringify(deduped.slice(0, 500)));
  return deduped;
};

export const getAttendanceSessions = () => {
  if (typeof window === 'undefined') return [];
  const parsed = parseJSON(localStorage.getItem(ATTENDANCE_SESSIONS_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
};

export const upsertAttendanceSession = (session) => {
  if (typeof window === 'undefined' || !session?.sessionId) return;

  const sessions = getAttendanceSessions();
  const idx = sessions.findIndex((item) => item.sessionId === session.sessionId);

  if (idx >= 0) {
    sessions[idx] = { ...sessions[idx], ...session };
  } else {
    sessions.unshift(session);
  }

  localStorage.setItem(ATTENDANCE_SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
};

export const getAttendanceSubmissions = () => {
  if (typeof window === 'undefined') return [];
  const parsed = parseJSON(localStorage.getItem(ATTENDANCE_SUBMISSIONS_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
};

export const addAttendanceSubmission = (submission) => {
  if (typeof window === 'undefined' || !submission?.sessionId) return;

  const submissions = getAttendanceSubmissions();
  const dedupeIndex = submissions.findIndex((item) => {
    const sameSession = item.sessionId === submission.sessionId;
    const sameStudent = (item.studentId && submission.studentId && item.studentId === submission.studentId) ||
      (!item.studentId && !submission.studentId && item.studentName === submission.studentName);
    return sameSession && sameStudent;
  });

  if (dedupeIndex >= 0) {
    submissions[dedupeIndex] = { ...submissions[dedupeIndex], ...submission };
  } else {
    submissions.unshift(submission);
  }

  localStorage.setItem(ATTENDANCE_SUBMISSIONS_KEY, JSON.stringify(submissions.slice(0, 500)));
  syncToMongo(submission);
};

export const getLatestActiveSession = () => {
  const sessions = getAttendanceSessions();
  const now = Date.now();

  return sessions.find((session) => !session.endedAt && (!session.expiresAt || session.expiresAt >= now)) || null;
};
