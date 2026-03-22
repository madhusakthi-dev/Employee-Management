const express = require('express');
const {
    markAttendance,
    getAttendance,
    getAllAttendance
} = require('../controllers/attendanceController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('admin'), getAllAttendance)
    .post(markAttendance);

router.route('/:employeeId')
    .get(getAttendance);

module.exports = router;
