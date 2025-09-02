// --- 1. IMPORTS ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contactUserRoutes = require('./routes/contactUserRoutes');
const subscriberRoutes = require("./routes/subscriberRoutes");

// --- 2. APP INITIALIZATION ---
const app = express();

// --- 3. CORE MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from the 'src/images' folder (Corrected 'scr' to 'src')
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// --- 4. API ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contactUser', contactUserRoutes);
app.use('/api/subscriber', subscriberRoutes);

// --- 5. PRODUCTION/DEVELOPMENT ROUTES ---
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  // Handle all other routes by serving the React app's index.html
  app.get('*', (req, res) => {
  });
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  // A root route for development mode to confirm the API is running
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    // res.send('API is running in development mode...');
  });
}

// --- 6. CUSTOM ERROR HANDLING ---
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

// --- 7. SERVER STARTUP ---
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Exiting...', error);
    process.exit(1);
  }
};

startServer();