const express = require('express');
const {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getStats,
    getPersonalStats
} = require('../controllers/employeeController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('admin'), getStats);
router.get('/me/stats/:id', getPersonalStats);

router.route('/')
    .get(getEmployees)
    .post(authorize('admin'), createEmployee);

router.route('/:id')
    .get(getEmployee)
    .put(authorize('admin'), updateEmployee)
    .delete(authorize('admin'), deleteEmployee);

module.exports = router;
