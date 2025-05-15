const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db-config');

const morgan = require('morgan');
const { apiLogger } = require('./middlewares/logger-middleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Elasticsearch
// const { initializeElastic } = require('./configs/elastic-config');
// initializeElastic();

// Route files
const authRoutes = require('./routes/auth-route');
const userRoutes = require('./routes/user-route');
const publicRoutes = require('./routes/public-route');
const uploadRoutes = require('./routes/upload-route')

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
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

module.exports = app;