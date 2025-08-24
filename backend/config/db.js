// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Optional: Add some connection options for robustness
            // useNewUrlParser: true, // Deprecated in Mongoose 6+
            // useUnifiedTopology: true, // Deprecated in Mongoose 6+
            serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn; // Return the connection object if successful
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Instead of exiting here, we'll let the caller (server.js) handle the exit
        throw error; // Re-throw the error so server.js can catch it
    }
};

module.exports = connectDB;