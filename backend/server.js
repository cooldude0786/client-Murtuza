// server.js
const express = require('express');
const cors = require('cors');
// Only import the connectDB function, as we'll handle success/failure here
const connectDB = require('./config/db');
const config = require('./config');
const path = require('path'); // Add this at the top with other requires
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config(); 

// --- Import individual route files directly ---
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactUserRoutes = require('./routes/contactUserRoutes');
const subscriberRoutes = require("./routes/subscriberRoutes");

// --- End Import individual route files ---

// Custom 404 handler middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'scr/images')));

// --- Define the server startup function ---
const startServer = async () => {
    try {
        // AWAIT the database connection
        await connectDB();

        // If DB connection is successful, then proceed to set up routes and start listening
        // --- Mount Individual API Routes ---
        app.use('/product', productRoutes);
        app.use('/users', userRoutes);
        app.use('/orders', orderRoutes);
        app.use('/contact', contactRoutes);
        app.use('/auth', authRoutes);
        app.use('/category', categoryRoutes);
        app.use('/contactUser', contactUserRoutes);
        app.use('/subscriber', subscriberRoutes);
        app.use('/auth', authRoutes);
        // --- End Mount Individual API Routes ---

        // Simple root route
        app.get('/', (req, res) => {
            res.send('E-commerce Backend API is running!');
        });

        // Error handling middleware (MUST be after all routes)
        app.use(notFound);
        app.use(errorHandler);

        // Start the server
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            console.log(`Access at: http://localhost:${PORT}`);
        });
    } catch (error) {
        // If DB connection fails, this catch block runs.
        console.error('Server failed to start due to database connection error. Exiting process.');
        console.log(error)
        // Exit the process, preventing the server from listening
        process.exit(1);
    }
};

// Call the async server startup function
startServer();