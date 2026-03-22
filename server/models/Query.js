const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String,
        enum: ['QUERY', 'COMPLAINT'],
        default: 'QUERY',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
        default: 'PENDING'
    },
    adminRemarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Query', querySchema);
