
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// --- USER ROUTES ---

// Sync User (Login/Register)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, email, avatar, lastLogin: new Date() },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get All Users with Stats
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().sort({ lastLogin: -1 });
    
    // Aggregate stats for each user
    const userStats = await Promise.all(users.map(async (user) => {
      // Find tasks belonging to this user (assuming tasks store userId or userEmail)
      // Note: In a real app, ensure Task model stores the correct linking ID.
      // Here we assume tasks might be linked by userId (which matches user.email for simplicity in this specific migration)
      // or we update the frontend to send the MongoDB _id.
      
      // For this implementation, we will look for tasks where userId matches the user's email 
      // (since the frontend mockup uses email/local storage logic often).
      const tasks = await Task.find({ userId: user.email });
      
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const totalSpent = tasks.reduce((sum, t) => sum + (t.amount || 0), 0);

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        totalTasks: tasks.length,
        completedTasks,
        totalSpent
      };
    }));

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- TASK ROUTES ---

// Get all tasks (Filtered by User Email in query for security in real app)
app.get('/api/tasks', async (req, res) => {
  const { userId } = req.query;
  try {
    const query = userId ? { userId } : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('TaskFlow API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
