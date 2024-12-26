const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; 
        console.log('Mongo URI:', mongoUri);  

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

module.exports = { connectDB };
