const admin = require('../firebaseAdmin'); // Import the initialized admin SDK

const verifyToken = async (req, res, next) => {
    // 1. Check for the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // 4. Attach the decoded user data (UID, email, etc.) to the request object
        req.user = decodedToken;
        
        // 5. Continue to the route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = verifyToken;