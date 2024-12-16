const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Quiz = require('../models/Quiz1');
const Score = require('../models/Score');
const auth = require('../middleware/auth');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');  // Add User import here
const router = express.Router();

// Create a new quiz
router.post('/create', auth, async (req, res) => {
    const { title, description, questions } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Quiz must have a title, description, and questions' });
    }

    try {
        const quiz = new Quiz({ title, description, questions, createdBy: req.user.id });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Attempt a quiz
router.post('/attempt/:quizId', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const { answers } = req.body;
        if (!answers || answers.length !== quiz.questions.length) {
            return res.status(400).json({ message: 'Incorrect number of answers' });
        }

        // Check if the user has already attempted the quiz
        const existingAttempt = await QuizAttempt.findOne({ quiz: quiz._id, user: req.user.id });
        if (existingAttempt) {
            return res.status(400).json({ message: 'You have already attempted this quiz' });
        }

        // Calculate the score
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer.answer === quiz.questions[index].answer) {
                score++;
            }
        });

        const attempt = new QuizAttempt({
            quiz: quiz._id,
            user: req.user.id,
            answers,
            score
        });

        await attempt.save();
        res.status(201).json({ score });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.send('Quiz routes are working!');
});

// Submit answers and calculate score
router.post('/:quizId/submit', auth, async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.answer === answers[index].answer) {
                score++;
            }
        });

        // Save score
        const newScore = new Score({ userId: req.user.id, quizId: quiz._id, score });
        await newScore.save();
        res.json({ score });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get leaderboard (top 10 scorers)
router.get('/:quizId/leaderboard', async (req, res) => {
    try {
        const scores = await Score.find({ quizId: req.params.quizId })
            .sort({ score: -1 })
            .limit(10);

        const leaderboard = await Promise.all(
            scores.map(async (score) => {
                const user = await User.findById(score.userId);
                return {
                    user: user ? user.username : 'Unknown',
                    score: score.score
                };
            })
        );

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get quiz by ID
router.get('/:quizId', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
