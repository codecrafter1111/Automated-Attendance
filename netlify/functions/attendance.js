const { MongoClient, ServerApiVersion } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

const getEnv = (key, fallback = '') => process.env[key] || fallback;

async function connectToMongo() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = getEnv('MONGODB_URI');
  const dbName = getEnv('MONGODB_DB_NAME', 'attendease');

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

exports.handler = async (event) => {
  try {
    const collectionName = getEnv('MONGODB_COLLECTION', 'recent_activities');
    const { db } = await connectToMongo();
    const collection = db.collection(collectionName);

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');

      if (!body.classId || !body.sessionId || !body.studentName) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'classId, sessionId, and studentName are required' }),
        };
      }

      const document = {
        classId: body.classId,
        className: body.className || '',
        sessionId: body.sessionId,
        studentId: body.studentId || '',
        studentName: body.studentName,
        studentEmail: body.studentEmail || '',
        method: body.method || 'qr',
        status: body.status || 'present',
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
        activityDate: body.timestamp ? new Date(body.timestamp) : new Date(),
        location: body.location || '',
        faculty: body.faculty || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        {
          classId: document.classId,
          sessionId: document.sessionId,
          studentName: document.studentName,
          studentId: document.studentId,
        },
        {
          $set: document,
        },
        { upsert: true }
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Attendance saved',
          upserted: Boolean(result.upsertedId),
        }),
      };
    }

    if (event.httpMethod === 'GET') {
      const classId = event.queryStringParameters?.classId;
      const limit = Number(event.queryStringParameters?.limit || 20);

      const query = classId ? { classId } : {};
      const docs = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: docs.map((doc) => ({
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
        }),
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Allow': 'GET, POST',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Attendance function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Failed to process attendance',
        error: error.message,
      }),
    };
  }
};
