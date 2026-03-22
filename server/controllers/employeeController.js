const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Get all employees
// @route   GET /api/v1/employees
// @access  Private (Admin)
exports.getEmployees = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = { $or: [
                { name: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } }
            ]};
        }

        const employees = await Employee.find(query).sort('-createdAt');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single employee
// @route   GET /api/v1/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Create employee
// @route   POST /api/v1/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Update employee
// @route   PUT /api/v1/employees/:id
// @access  Private (Admin)
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Employee Stats
// @route   GET /api/v1/employees/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
    try {
        const total = await Employee.countDocuments();
        const active = await Employee.countDocuments({ status: 'Active' }); // Matches enum in Employee.js
        res.status(200).json({ success: true, data: { total, active } });
    } catch (err) {
        next(err);
    }
};

// @desc    Get personal employee stats
// @route   GET /api/v1/employees/me/stats/:id
// @access  Private
exports.getPersonalStats = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

        const attendance = await Attendance.find({ employee: req.params.id }).sort('-date');
        
        const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
        const totalDays = attendance.length;
        const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

        res.status(200).json({ 
            success: true, 
            data: { 
                employee,
                stats: {
                    attendanceRate: `${attendanceRate}%`,
                    presentDays,
                    totalDays,
                    status: employee.status
                },
                recentAttendance: attendance.slice(0, 5)
            } 
        });
    } catch (err) {
        next(err);
    }
};
