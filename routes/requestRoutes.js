import express from "express";
import {
  submitRequest,
  getMyRequests,
  getRequestsForMyFood,
  updateRequestStatus
} from "../controllers/requestController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/', verifyToken, submitRequest);
router.get('/my-requests', verifyToken, getMyRequests);
router.get('/food/:foodId', verifyToken, getRequestsForMyFood);
router.patch('/:requestId', verifyToken, updateRequestStatus);

export default router;
