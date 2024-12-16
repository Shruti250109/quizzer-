const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Step 1: Get the token from Authorization header (Bearer <token>)
        const token = req.header('Authorization')?.split(' ')[1];
        
        // Step 2: Check if the token is missing
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        // Step 3: Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 4: Check if user exists using the decoded user ID
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 5: Attach user to the request object
        req.user = user;
        
        // Step 6: Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error(error.message); // Optionally log the error
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
