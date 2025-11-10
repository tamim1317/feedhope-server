const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    food_name: {
        type: String,
        required: true,
        trim: true,
    },
    food_image: {
        type: String,
        required: true,
    },
    food_quantity: {
        type: String,
        required: true,
    },
    pickup_location: {
        type: String,
        required: true,
        trim: true,
    },
    expire_date: {
        type: Date,
        required: true,
    },
    additional_notes: {
        type: String,
        default: '',
    },
    // Status
    food_status: {
        type: String,
        enum: ['Available', 'Donated'],
        default: 'Available',
        required: true,
    },
    // Donator Info
    donator_name: {
        type: String,
        required: true,
    },
    donator_email: {
        type: String,
        required: true,
    },
    donator_image: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Food', FoodSchema);