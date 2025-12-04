import FoodRequest from "../models/FoodRequest.js";

export const submitRequest = async (req, res) => {
  try {
    const foodRequest = new FoodRequest({
      ...req.body,
      requesterEmail: req.user.email,
      requesterName: req.user.name,
      requesterImage: req.user.picture || ""
    });
    const savedRequest = await foodRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.find({ requesterEmail: req.user.email });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRequestsForMyFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const requests = await FoodRequest.find({ foodId });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await FoodRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
