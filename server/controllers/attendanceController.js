const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/v1/attendance
// @access  Private (Admin/Employee)
exports.markAttendance = async (req, res, next) => {
    try {
        const { employeeId, status, date, remarks } = req.body;
        
        // Ensure date is just the day (YYYY-MM-DD) in UTC
        const d = date ? new Date(date) : new Date();
        d.setUTCHours(0, 0, 0, 0); // Set to UTC start of the day

        const attendance = await Attendance.findOneAndUpdate(
            { employee: employeeId, date: d },
            { status, remarks },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get attendance history
// @route   GET /api/v1/attendance/:employeeId
// @access  Private
exports.getAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ employee: req.params.employeeId }).sort('-date');
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all attendance records (for admin)
// @route   GET /api/v1/attendance
// @access  Private (Admin)
exports.getAllAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find().populate('employee', 'name employeeId').sort('-date');
        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        next(err);
    }
};
