const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

MONGODB_URI='mongodb+srv://madhugoud:Madhu162@mern.ogz9oev.mongodb.net/'
JWT_SECRET='Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK'


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://task-manager-anxu.vercel.app'], // Specify the allowed origin (replace example.com with your actual domain)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the allowed HTTP methods
  credentials: true, // Allow sending cookies with the requests
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Register route
app.post('/register', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Get tasks
app.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in /tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new task
app.post('/tasks/:userId', verifyToken, async (req, res) => {
  const { task, status, category, deadline, priority } = req.body;
  const userId = req.params.userId;

  if (!task || !status || !category || !deadline || !priority) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTask = new Task({
      task,
      status,
      category,
      deadline,
      priority,
      userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error in /tasks/:userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a task
app.put('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;
  const { task, status, category, deadline, priority } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, {
      task,
      status,
      category,
      deadline,
      priority
    }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in /tasks/:id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a task
app.delete('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in /tasks/:id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle any other requests by returning the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
