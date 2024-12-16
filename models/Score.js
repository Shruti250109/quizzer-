const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    score: { 
        type: Number, 
        required: true,
        min: 0,  // Ensure score is non-negative
        max: 100 // Assuming the score is out of 100, adjust if necessary
    }
}, { 
    timestamps: true  // Automatically add createdAt and updatedAt
});

// Ensure that the combination of userId and quizId is unique
scoreSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
