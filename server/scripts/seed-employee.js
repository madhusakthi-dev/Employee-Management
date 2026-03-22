const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

dotenv.config();

const seedEmployee = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 1. Create Employee
        let employee = await Employee.findOne({ employeeId: 'EMP001' });
        if (!employee) {
            employee = await Employee.create({
                name: 'John Doe',
                employeeId: 'EMP001',
                position: 'Software Engineer',
                salary: 50000,
                email: 'john@ems.com',
                status: 'Active'
            });
            console.log('Employee created');
        }

        // 2. Create User
        let user = await User.findOne({ email: 'john@ems.com' });
        if (!user) {
            user = await User.create({
                username: 'johndoe',
                email: 'john@ems.com',
                password: 'password123',
                role: 'employee',
                employeeId: employee._id
            });
            console.log('User created');
        }

        // 3. Create some attendance
        const today = new Date();
        today.setUTCHours(0,0,0,0);
        
        for(let i=1; i<=5; i++) {
            const date = new Date(today);
            date.setUTCDate(today.getUTCDate() - i);
            await Attendance.findOneAndUpdate(
                { employee: employee._id, date },
                { status: i % 3 === 0 ? 'ABSENT' : 'PRESENT', remarks: 'Test entry' },
                { upsert: true }
            );
        }
        console.log('Attendance seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedEmployee();
