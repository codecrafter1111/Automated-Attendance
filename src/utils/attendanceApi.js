const ATTENDANCE_API_BASE = import.meta.env.VITE_ATTENDANCE_API_BASE || '/api/attendance';

const hasWindow = typeof window !== 'undefined';

const safeJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    return { raw: text };
  }
};

export const saveAttendanceToMongo = async (payload) => {
  if (!hasWindow) return null;

  try {
    const response = await fetch(ATTENDANCE_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await safeJson(response);
  } catch (error) {
    console.error('Failed to save attendance to MongoDB:', error);
    return null;
  }
};

export const fetchAttendanceFromMongo = async ({ classId, limit = 20 } = {}) => {
  if (!hasWindow) return [];

  try {
    const params = new URLSearchParams();
    if (classId) params.set('classId', classId);
    params.set('limit', String(limit));

    const response = await fetch(`${ATTENDANCE_API_BASE}?${params.toString()}`);
    if (!response.ok) return [];

    const data = await safeJson(response);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch attendance from MongoDB:', error);
    return [];
  }
};
