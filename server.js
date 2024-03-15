const express = require('express');
require('dotenv').config();
const connectionPool = require('./db_connect'); // Import the connection pool
const authenticateUser = require('./Controllers/authenticate')
const cors = require('cors'); 
const addUser = require('./Controllers/users')
const students = require('./Controllers/students')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Enable CORS for all origins
app.use(cors());

// Use the connection pool in your routes
app.use((req, res, next) => {
  req.connectionPool = connectionPool;
  next();
});

// Login endpoint with authenticate middleware
app.post('/login', authenticateUser, (req, res) => {
  // If execution reaches here, user is authenticated
  const { username, role } = req.user;
  res.json({ success: true, user: { username, role } });
});

// Add a new user endpoint
app.post('/add-user', addUser);

app.get('/students/:batch/:section', async (req, res) => {
  const { batch, section } = req.params;

  try {
    const studentsData = await students.getStudentData(batch, section);
    res.json(studentsData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/students', async (req, res) => {
  try {
    await dataAccess.addStudent(req.body);
    res.status(201).send('Student added successfully');
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Error adding student');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(process.env.PORT)
});

