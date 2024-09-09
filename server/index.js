// server.js
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const cors = require("cors")
const path = require('path');

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Owolabi123$',
  database: 'fileupload'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: 'http://localhost:3000' 
  }));

// Routes
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.image;
  const fileName = `${Date.now()}_${uploadedFile.name}`;
  const uploadPath = `${__dirname}/uploads/${fileName}`;

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const { firstName, lastName } = req.body;
    const query = 'INSERT INTO users (first_name, last_name, image_path) VALUES (?, ?, ?)';
    db.query(query, [firstName, lastName, fileName], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send('File uploaded and data saved successfully!');
    });
  });
});


app.get('/users', (req, res) => {
    const query = 'SELECT first_name, last_name, image_path FROM users';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
app.listen(3800, () => {
  console.log('Server is running on port 3800');
});