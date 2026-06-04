const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://althafk039_db_user:Al123@cluster0.agmx4hu.mongodb.net/test?retryWrites=true&w=majority';

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

const Task = mongoose.model(
  'Task',
  new mongoose.Schema({
    subject: String,
    taskDetails: String,
    deadline: String,
  })
);

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: 'User created',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// LOGIN (NO JWT)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({
      username,
      password,
    });

    if (!foundUser) {
      return res.status(401).json({
        message: 'Wrong username or password',
      });
    }

    res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET ALL TASKS
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// CREATE TASK
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      subject: req.body.subject,
      deadline: req.body.deadline,
      taskDetails: req.body.taskDetails,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

// DELETE TASK
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Task deleted',
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});