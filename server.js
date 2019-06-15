const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;

// Initialize Express
const app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Connect to the Mongo DB
connectDB();

// * Define API Routes
app.use('/api/scrape', require('./routes/api/scrape'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/reviews', require('./routes/api/reviews'));

// * Start Server
app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);
