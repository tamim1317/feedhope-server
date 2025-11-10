const admin = require('../firebaseAdmin');

const verifyToken = async (req, res, next) => {
    // Check for Authorization header
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized: No token provided.' });
    }

 const idToken = tokenHeader.split(' ')[1];

    try {
        // Verify the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // UID, email.. to the request object
        req.user = decodedToken;
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        // Handle common errors
        return res.status(401).send({ message: 'Unauthorized: Invalid or expired token.' });
    }
};

module.exports = verifyToken;