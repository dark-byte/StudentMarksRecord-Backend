const connectionPool = require("../db_connect");

const getStudentData = async (batch, section) => {
    try {
      const connection = await connectionPool.getConnection();
  
      // Join student and marks tables based on USN
      const [studentsData] = await connection.query(
        `SELECT s.Name, m.*
         FROM students s
         INNER JOIN marks m ON s.USN = m.USN
         WHERE s.batch = ? AND s.section = ?`,
        [batch, section]
      );
  
      connection.release();
      return studentsData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for handling in the main server file
    }
};


const addStudent = async (studentData) => {
    try {
      const connection = await pool.getConnection();
  
      // Insert student details into students table
      await connection.query(
        `INSERT INTO students (Name, USN, Section) VALUES (?, ?, ?)`,
        [studentData.name, studentData.usn, studentData.section]
      );
  
      // Get the ID of the newly added student
      const studentId = connection.insertId;
  
      // Insert student marks into marks table
      await connection.query(
        `INSERT INTO marks (USN, IA1, IA2, IA3, Assignment1, Assignment2, CIE_Component)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          studentData.ia1,
          studentData.ia2,
          studentData.ia3,
          studentData.assignment1,
          studentData.assignment2,
          studentData.cie,
        ]
      );
  
      connection.release();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error; // Re-throw the error for handling in the main server file
    }
  };
  

module.exports = { getStudentData, addStudent };