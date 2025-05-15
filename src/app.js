const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db-config');

const morgan = require('morgan');
const { initializeElastic } = require('./configs/elastic-config');
const { apiLogger } = require('./middlewares/logger-middleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Elasticsearch
initializeElastic();

// Route files
const authRoutes = require('./routes/auth-route');
const userRoutes = require('./routes/user-route');
const publicRoutes = require('./routes/public-route');

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API logger middleware
app.use(apiLogger);

// Routing
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

module.exports = app;