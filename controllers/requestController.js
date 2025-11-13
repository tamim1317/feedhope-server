const FoodRequest = require('../models/FoodRequest');
const Food = require('../models/Food');

// --- 1. Submit Request (Private Create) ---
// Route: POST /api/requests
exports.submitRequest = async (req, res) => {
    try {
        const { foodId, location, whyNeedFood, contactNo } = req.body;
        const requestorInfo = req.user; // Info from verifyToken middleware

        // 1. Fetch the Food item to get the Owner's email and check availability
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'The food item requested was not found.' });
        }
        
        // Validation: Prevent the food owner from requesting their own food
        if (food.donatorEmail === requestorInfo.email) {
             return res.status(403).json({ message: 'You cannot request your own donated food.' });
        }

        // Validation: Prevent requesting non-available food
        if (food.food_status !== 'Available') {
            return res.status(400).json({ message: `This food is already marked as ${food.food_status}.` });
        }

        // 2. Create the new request
        const newRequest = new FoodRequest({
            foodId,
            foodOwnerEmail: food.donatorEmail,
            requestorEmail: requestorInfo.email,
            requestorName: requestorInfo.name,
            requestorPhotoURL: requestorInfo.picture || '',
            location,
            whyNeedFood,
            contactNo,
            status: 'pending' 
        });

        await newRequest.save();
        res.status(201).json({ 
            message: 'Food request submitted successfully!',
            request: newRequest 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        console.error("Failed to submit food request:", error);
        res.status(500).json({ message: 'Failed to submit food request.', error: error.message });
    }
};

// --- 2. Get My Submitted Requests (Read List for Requestor) ---
// Route: GET /api/requests/my-requests
exports.getMyRequests = async (req, res) => {
    try {
        // SECURITY: Use the email from the verified token
        const requestorEmail = req.user.email; 

        // Fetch requests made by the logged-in user, and populate the food details
        const myRequests = await FoodRequest.find({ requestorEmail })
            .populate('foodId') // Retrieve the full Food document linked to the request
            .sort({ createdAt: -1 });
        
        // Filter out requests where the food item might have been deleted
        const validRequests = myRequests.filter(req => req.foodId !== null);

        res.status(200).json(validRequests);
    } catch (error) {
        console.error("Error fetching user's requests:", error);
        res.status(500).json({ message: 'Error fetching your submitted requests.', error: error.message });
    }
};


// --- 3. Get Requests FOR My Food (Read List for Donator) ---
// Route: GET /api/requests/food/:foodId
exports.getRequestsForMyFood = async (req, res) => {
    try {
        const { foodId } = req.params;
        const loggedInUserEmail = req.user.email;
        
        // 1. Authorization Check: Fetch the Food item to verify ownership
        const food = await Food.findById(foodId);
        
        if (!food) {
            return res.status(404).json({ message: 'Food item not found.' });
        }
        
        if (food.donatorEmail !== loggedInUserEmail) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this food item.' });
        }

        // 2. Fetch all requests for this food
        const requests = await FoodRequest.find({ foodId })
            .sort({ status: 1, createdAt: 1 }); // Pending requests first

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching food requests:", error);
        res.status(500).json({ message: 'Error fetching food requests.', error: error.message });
    }
};

// --- 4. Update Request Status (Accept/Reject - Private Update - ONLY for Owner) ---
// Route: PATCH /api/requests/:requestId
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // Expects 'accept' or 'reject'
        const loggedInUserEmail = req.user.email;
        
        // 1. Find the request and populate the associated food item
        const request = await FoodRequest.findById(requestId).populate('foodId');

        if (!request) {
            return res.status(404).json({ message: 'Food request not found.' });
        }
        
        // 2. Authorization Check: Must be the food owner
        if (request.foodOwnerEmail !== loggedInUserEmail) {
            return res.status(403).json({ message: 'Forbidden: You cannot modify this request.' });
        }
        
        // 3. Process the action
        if (action === 'accept') {
            // Check if the food status is still 'Available' before accepting
            if (!request.foodId || request.foodId.food_status !== 'Available') {
                 return res.status(400).json({ message: 'Cannot accept, food is already donated or deleted.' });
            }
            
            // Set request status
            request.status = 'accepted';
            
            // CRITICAL: Change Food Status to 'Donated'
            if (request.foodId) {
                request.foodId.food_status = 'Donated';
                await request.foodId.save();
            }
            
            // CHALLENGE: Reject all other pending requests for the same food
            await FoodRequest.updateMany(
                { foodId: request.foodId._id, _id: { $ne: requestId }, status: 'pending' },
                { $set: { status: 'rejected' } }
            );

        } else if (action === 'reject') {
            request.status = 'rejected';
            
        } else {
            return res.status(400).json({ message: 'Invalid action specified. Must be "accept" or "reject".' });
        }

        await request.save();
        res.status(200).json({ 
            message: `Request successfully ${request.status}.`,
            request 
        });

    } catch (error) {
        console.error("Failed to process request action:", error);
        res.status(500).json({ message: 'Failed to process request action.', error: error.message });
    }
};