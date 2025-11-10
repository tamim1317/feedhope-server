const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    // Requested to the food item
    food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
    food_name: {
        type: String,
        required: true,
    },
    // Requester Info
    requester_email: {
        type: String,
        required: true,
    },
    requester_name: {
        type: String,
        required: true,
    },
    requester_image: {
        type: String,
        required: true,
    },
    // Request details
    pickup_location: {
        type: String,
        required: true,
    },
    why_need_food: {
        type: String,
        required: true,
    },
    contact_no: {
        type: String,
        required: true,
    },
    // Status
    request_status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
        required: true,
    },
    requested_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FoodRequest', RequestSchema);