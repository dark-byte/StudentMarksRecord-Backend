const connectionPool = require("../db_connect")
const bcrypt = require('bcrypt');

// Function to add a new user
const addUser = async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      // Generate a salt for password hashing
      const saltRounds = 10; // Adjust saltRounds as needed
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Check if the user already exists
      const checkQuery = `SELECT * FROM users WHERE username = ?`;
      const [results] = await connectionPool.query(checkQuery, [username]);
  
      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Add the new user with the hashed password
      const insertQuery = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
      await connectionPool.query(insertQuery, [username, hashedPassword, role]);
  
      res.json({ success: true, message: 'User added successfully' });
    } catch (err) {
      console.error('Error:', err.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
module.exports = addUser;
