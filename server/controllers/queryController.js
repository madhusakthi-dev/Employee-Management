const Query = require('../models/Query');

// @desc    Submit a query or complaint
// @route   POST /api/v1/queries
// @access  Private (Employee)
exports.submitQuery = async (req, res, next) => {
    try {
        const { type, subject, message, employeeId } = req.body;
        
        const query = await Query.create({
            employee: employeeId,
            type,
            subject,
            message
        });

        res.status(201).json({ success: true, data: query });
    } catch (err) {
        next(err);
    }
};

// @desc    Get personal queries/complaints
// @route   GET /api/v1/queries/me/:employeeId
// @access  Private (Employee)
exports.getPersonalQueries = async (req, res, next) => {
    try {
        const queries = await Query.find({ employee: req.params.employeeId }).sort('-createdAt');
        res.status(200).json({ success: true, count: queries.length, data: queries });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all queries
// @route   GET /api/v1/queries
// @access  Private (Admin)
exports.getAllQueries = async (req, res, next) => {
    try {
        const queries = await Query.find().populate('employee', 'name employeeId').sort('-createdAt');
        res.status(200).json({ success: true, count: queries.length, data: queries });
    } catch (err) {
        next(err);
    }
};

// @desc    Update query status
// @route   PUT /api/v1/queries/:id
// @access  Private (Admin)
exports.updateQueryStatus = async (req, res, next) => {
    try {
        const { status, adminRemarks } = req.body;
        const query = await Query.findByIdAndUpdate(req.params.id, { status, adminRemarks }, {
            new: true,
            runValidators: true
        });

        if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

        res.status(200).json({ success: true, data: query });
    } catch (err) {
        next(err);
    }
};
