const connectionPool = require("../db_connect");

const getStudentData = async (batch, subCode, section) => {
    try {
      const connection = await connectionPool.getConnection();
  
      // Join student and marks tables based on USN
      const [studentsData] = await connection.query(
        `SELECT s.Name, m.*
         FROM students s
         INNER JOIN marks m ON s.USN = m.USN
         WHERE s.batch = ? AND s.section = ? AND  m.sub_code = ?`,
        [batch, section, subCode]
      );
  
      connection.release();
      return studentsData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for handling in the main server file
    }
};


const addStudentData = async (studentData) => {
    try {
      const connection = await connectionPool.getConnection();
  
      // Insert student marks into marks table
      await connection.query(
        `INSERT INTO marks (USN, IA1, IA2, IA3, Assignment1, Assignment2, CIE_Component, sub_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentData.usn,
          studentData.ia1,
          studentData.ia2,
          studentData.ia3,
          studentData.assignment1,
          studentData.assignment2,
          studentData.cie,
          studentData.subCode
        ]
      );
  
      connection.release();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error; // Re-throw the error for handling in the main server file
    }
  };
  

  const getStudentMarks = async (usn) => {
    try {
      const connection = await connectionPool.getConnection();
  
      // Join student and marks tables based on USN
      const [studentData] = await connection.query(
        `SELECT s.Name, s.batch, s.section, m.*
         FROM students s
         INNER JOIN marks m ON s.USN = m.USN
         WHERE s.USN = ?`,
        [usn]
      );
  
      connection.release();
      return studentData;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error; // Re-throw the error for handling in the main server file
    }
  };

module.exports = { getStudentData, addStudentData, getStudentMarks };