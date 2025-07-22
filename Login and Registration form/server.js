const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ensure JSON parsing if needed
app.use(express.static('index.html'));

// --- MongoDB Connection ---
mongoose.connect('mongodb://localhost:27017/Registration', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
  auth: {
    username: '#',
    password: '#'
  },
  authSource: 'admin' // Replace if your user lives in a different DB
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// --- Mongoose Schema ---
const studentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
});

//model
const Student = mongoose.model('Student', studentSchema);

// --- Sync Indexes Once ---
Student.syncIndexes()
  .then(() => console.log('🔄 Indexes synced for Student collection'))
  .catch(err => console.error('⚠ Index sync error:', err.message));

  const path = require('path');

//After this check for localhost if it runs successfully
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Registration Route ---
app.post('/register', async (req, res) => {
  console.log('📥 Received registration data:', req.body);

  try {
    const { fullname, email, password, department } = req.body;

    // Validate all fields
    if (!fullname || !email || !password || !department) {
      return res.status(400).send('Please fill all required fields.');
    }

    // Check for existing email
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered. Please login.');
    }

    // Hash password and save user
    const hash = await bcrypt.hash(password, 10);
    const student = new Student({ fullname, email, password: hash, department });

    await student.save();
    res.send('🎉 Registration successful');
  } catch (error) {
    console.error('🛑 Registration error:', error.message);

    // Handle duplicate email index error
    if (error.code === 11000) {
      return res.status(400).send('This email is already in use.');
    }

    res.status(500).send('Server error: ' + error.message);
  }
});

// --- Login Route ---
app.post('/login', async (req, res) => {
  console.log('🔐 Login attempt:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).send('Invalid email.');

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).send('Invalid password.');

    res.send('✅ Login successful');
  } catch (error) {
    console.error('🛑 Login error:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// --- Start Server ---
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});