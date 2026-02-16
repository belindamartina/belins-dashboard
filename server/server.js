const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'belins';

app.use(cors({
  origin: '*', // Allow all origins for now to fix connection issues
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

let db;
let tasksCollection;

// In-memory fallback if MongoDB is not available
let inMemoryTasks = [];
let useInMemory = false;
let nextId = 1;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    tasksCollection = db.collection('tasks');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('⚠️  MongoDB not available — using in-memory storage');
    useInMemory = true;
  }
}

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    if (useInMemory) {
      return res.json(inMemoryTasks);
    }
    const tasks = await tasksCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
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
    if (useInMemory) {
      task._id = String(nextId++);
      inMemoryTasks.unshift(task);
      return res.status(201).json(task);
    }
    const result = await tasksCollection.insertOne(task);
    task._id = result.insertedId;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle task completion
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useInMemory) {
      const task = inMemoryTasks.find((t) => t._id === id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      task.completed = !task.completed;
      return res.json(task);
    }
    const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: !task.completed } }
    );
    res.json({ ...task, completed: !task.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useInMemory) {
      const idx = inMemoryTasks.findIndex((t) => t._id === id);
      if (idx === -1) return res.status(404).json({ error: 'Task not found' });
      inMemoryTasks.splice(idx, 1);
      return res.json({ success: true });
    }
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export app for Vercel
module.exports = app;

// Only start server if run directly
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Belins API running on http://localhost:${PORT}`);
    });
  });
} else {
  // Start connection for serverless environment
  connectDB();
}
