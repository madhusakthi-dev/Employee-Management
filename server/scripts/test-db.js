const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    console.log('--- Database Connection Test ---');
    console.log('URI:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@')); // Hide password

    try {
        console.log('Attempting to connect...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS: Connected to MongoDB successfully!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);

        if (err.message.includes('querySrv ECONNREFUSED')) {
            console.log('\n--- SUGGESTED FIX ---');
            console.log('Your network or DNS does not support SRV records (mongodb+srv://).');
            console.log('Please try the "Standard Connection String" (3.4 or earlier) from MongoDB Atlas.');
            console.log('It starts with "mongodb://" and lists multiple hostnames.');
        }

        process.exit(1);
    }
};

testConnection();
