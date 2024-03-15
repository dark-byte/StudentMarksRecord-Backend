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

app.get('/students/:batch/:subCode/:section', async (req, res) => {
  const { batch, subCode , section } = req.params;

  try {
    const studentsData = await students.getStudentData(batch, subCode, section);
    res.json(studentsData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/marks', async (req, res) => {
  try {
    await students.addStudentData(req.body);
    res.status(201).send('Student added successfully');
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Error adding student');
  }
});

app.get('/marks/:usn', async (req, res) => {
  const { usn } = req.params;

  try {
    const studentData = await students.getStudentMarks(usn);
    if (!studentData.length) {
      return res.status(404).send('Student not found');
    }
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(process.env.PORT)
});

