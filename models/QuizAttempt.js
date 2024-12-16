const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizAttemptSchema = new Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    score: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);