const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection parameters
const dbConfig = {
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'root_password',
  database: 'my_database',
};

// Function to create a MySQL connection
const createConnection = () => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err);
      throw err;
    }
  });

  return connection;
};

// Define a route to handle form submissions
app.post('/submit-form', (req, res) => {
  // Get form data from the request body
  const { name, email, message } = req.body;

  // Validate data
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).send('Invalid email format.');
  }

  // Create a connection
  const connection = createConnection();

  // Prepare the SQL statement
  const sql = 'INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)';
  const values = [name, email, message];

  // Execute the SQL statement
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send('An error occurred while submitting the form.');
    }

    // Success
    res.status(200).send('Form submitted successfully.');
  });

  // Close the connection
  connection.end();
});

// Start the Express server on a specific port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
