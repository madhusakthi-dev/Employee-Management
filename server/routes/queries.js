const express = require('express');
const {
    submitQuery,
    getPersonalQueries,
    getAllQueries,
    updateQueryStatus
} = require('../controllers/queryController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('admin'), getAllQueries)
    .post(submitQuery);

router.route('/me/:employeeId')
    .get(getPersonalQueries);

router.route('/:id')
    .put(authorize('admin'), updateQueryStatus);

module.exports = router;
