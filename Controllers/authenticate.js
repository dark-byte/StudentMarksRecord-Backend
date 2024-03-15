const connectionPool = require("../db_connect");
const bcrypt = require('bcrypt');

async function authenticateUser (req, res, next) {
  try {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    const [result] =  await connectionPool.query(query, [username])

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err.stack);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.user = user;
      next(); // Proceed to next middleware
    });

  } catch (err) {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticateUser;
