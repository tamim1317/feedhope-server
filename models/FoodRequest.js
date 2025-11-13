const mongoose = require('mongoose');

const FoodRequestSchema = new mongoose.Schema({
    // Link to the Food Item
    foodId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Food', 
        required: true, 
        index: true // Index for fast lookup on Food Details page
    },
    foodName: { type: String, required: true },
    foodImage: { type: String },

    // Requester Info (Auto-filled from Firebase user)
    requesterEmail: { type: String, required: true },
    requesterName: { type: String, required: true },
    requesterImage: { type: String },
    
    // Request Details from Modal
    requestLocation: { type: String, required: true },
    whyNeedFood: { type: String, required: true },
    contactNo: { type: String, required: true },

    // Request Status (Challenge requirement)
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending',
        required: true
    },
    
    // Timestamps
    requestedAt: { type: Date, default: Date.now }
});

const FoodRequest = mongoose.model('FoodRequest', FoodRequestSchema);
module.exports = FoodRequest;
