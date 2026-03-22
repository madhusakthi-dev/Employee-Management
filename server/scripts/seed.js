const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = await User.create({
            username: 'admin',
            email: 'admin@ems.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@ems.com');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
