const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'belins';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// --- Database Connection Handling ---
let cachedClient = null;
let cachedDb = null;
let useInMemory = false;
let inMemoryTasks = [];
let nextId = 1;

async function getCollection() {
  // If we already decided to use in-memory, return null immediately
  if (useInMemory) return null;

  // If we have a cached connection, return it
  if (cachedDb) {
    return cachedDb.collection('tasks');
  }

  try {
    // If no connection, try to connect
    if (!cachedClient) {
      cachedClient = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        connectTimeoutMS: 10000,
      });
      await cachedClient.connect();
      console.log('✅ New connection to MongoDB established');
    }

    cachedDb = cachedClient.db(DB_NAME);
    return cachedDb.collection('tasks');
  } catch (err) {
    console.error('⚠️ MongoDB Connection Failed:', err.message);
    useInMemory = true;
    return null;
  }
}

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    storage: useInMemory ? 'in-memory' : 'mongodb',
    env: process.env.VERCEL ? 'vercel' : 'local' 
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    const collection = await getCollection();
    if (!collection) return res.json(inMemoryTasks);

    const tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }
    const task = {
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection();
    if (!collection) {
      task._id = String(nextId++);
      inMemoryTasks.unshift(task);
      return res.status(201).json(task);
    }

    const result = await collection.insertOne(task);
    task._id = result.insertedId;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection();

    if (!collection) {
      const task = inMemoryTasks.find((t) => t._id === id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      task.completed = !task.completed;
      return res.json(task);
    }

    const task = await collection.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: !task.completed } }
    );
    res.json({ ...task, completed: !task.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection();

    if (!collection) {
      const idx = inMemoryTasks.findIndex((t) => t._id === id);
      if (idx === -1) return res.status(404).json({ error: 'Task not found' });
      inMemoryTasks.splice(idx, 1);
      return res.json({ success: true });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Belins API running on http://localhost:${PORT}`);
  });
}
