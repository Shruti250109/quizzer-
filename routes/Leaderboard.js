const express = require('express');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User'); // To fetch user details
const router = express.Router();

// Route to get the leaderboard for a specific quiz
router.get('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination with default values
    
    try {
        // Fetch quiz attempts sorted by score in descending order with pagination
        const quizAttempts = await QuizAttempt.find({ quiz: quizId })
            .sort({ score: -1 })
            .skip((page - 1) * limit) // Skip the number of documents for pagination
            .limit(Number(limit));  // Convert limit to a number

        // Extract all unique user IDs for this quiz
        const userIds = quizAttempts.map(attempt => attempt.user);

        // Fetch all users in one query (using unique user IDs)
        const users = await User.find({ '_id': { $in: userIds } });

        // Create a map for fast lookup by user ID
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username; // Map user ID to username
            return acc;
        }, {});

        // Construct the leaderboard
        const leaderboard = quizAttempts.map(attempt => ({
            user: userMap[attempt.user.toString()] || 'Unknown', // Use map to get username
            score: attempt.score
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
