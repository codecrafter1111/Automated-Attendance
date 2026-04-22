const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';
const DB_NAME = process.env.MONGODB_DB_NAME || 'Prabhat';
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'users';

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  cachedDb = client.db(DB_NAME);
  return cachedDb;
}

app.get('/api/attendance', async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const classId = req.query.classId;
    const limit = Number(req.query.limit || 20);

    const query = classId ? { classId } : {};
    const items = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    res.json({
      items: items.map((doc) => ({
        id: doc._id?.toString(),
        classId: doc.classId,
        className: doc.className,
        sessionId: doc.sessionId,
        studentId: doc.studentId,
        studentName: doc.studentName,
        studentEmail: doc.studentEmail,
        method: doc.method,
        status: doc.status,
        timestamp: doc.timestamp,
        activityDate: doc.activityDate,
        location: doc.location,
        faculty: doc.faculty,
      })),
    });
  } catch (error) {
    console.error('GET /api/attendance failed:', error);
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.classId || !body.sessionId || !body.studentName) {
      return res.status(400).json({
        message: 'classId, sessionId, and studentName are required',
      });
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const eventDate = body.timestamp ? new Date(body.timestamp) : now;

    const document = {
      classId: body.classId,
      className: body.className || '',
      sessionId: body.sessionId,
      studentId: body.studentId || '',
      studentName: body.studentName,
      studentEmail: body.studentEmail || '',
      method: body.method || 'qr',
      status: body.status || 'present',
      timestamp: eventDate,
      activityDate: eventDate,
      location: body.location || '',
      faculty: body.faculty || '',
      updatedAt: now,
    };

    const result = await collection.updateOne(
      {
        classId: document.classId,
        sessionId: document.sessionId,
        studentId: document.studentId,
        studentName: document.studentName,
      },
      {
        $set: document,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    res.json({
      message: 'Attendance saved to MongoDB',
      upserted: Boolean(result.upsertedId),
    });
  } catch (error) {
    console.error('POST /api/attendance failed:', error);
    res.status(500).json({ message: 'Failed to save attendance', error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbName: DB_NAME, collection: COLLECTION_NAME });
});

app.listen(PORT, () => {
  console.log(`Attendance API running at http://127.0.0.1:${PORT}`);
});
