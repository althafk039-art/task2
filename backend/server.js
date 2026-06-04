// server.js
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Force Node to use public DNS servers for Atlas SRV resolution.
dns.setServers(['8.8.8.8', '1.1.1.1']);
   
const mongoUri = process.env.MONGODB_URI ||
    'mongodb+srv://althafk039_db_user:Al123@cluster0.agmx4hu.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

const taskSchema = new mongoose.Schema({
    subject: String,
    taskDetails: String,
    deadline: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Task = mongoose.model('Task', taskSchema);

app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = verified; 
        next(); 
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findOne({ username, password });
        if (foundUser) {
            const token = jwt.sign({ userId: foundUser._id }, 'YOUR_SECRET_KEY', { expiresIn: '1d' });
            res.status(200).json({ token, message: "login successful" });
        } else {
            res.status(401).json({ message: "wrong user name or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const newTask = new Task({
            subject: req.body.subject,
            deadline: req.body.deadline,
            taskDetails: req.body.taskDetails,
            userId: req.user.userId
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const userTasks = await Task.find({ userId: req.user.userId });
        res.json(userTasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));