// Server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./UserModel'); // Make sure UserModel.js exists

const app = express();
const PORT = 5000;

// ✅ MongoDB Atlas Connection URI
const MONGO_URI = "mongodb+srv://devopsplay:devopsplayxyz@cluster0.zdsdxyh.mongodb.net/authDB?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB and Start Server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });


// ------------------ SIGNUP --------------------
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});


// ------------------ LOGIN --------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});
