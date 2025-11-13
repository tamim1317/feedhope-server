const express = require('express');
const {
    submitRequest,
    getMyRequests,
    getRequestsForMyFood,
    updateRequestStatus
} = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// --- Private Routes (Requires verifyToken) ---
router.post('/', verifyToken, submitRequest);
router.get('/my-requests', verifyToken, getMyRequests);
router.get('/food/:foodId', verifyToken, getRequestsForMyFood);
router.patch('/:requestId', verifyToken, updateRequestStatus);

module.exports = router;
