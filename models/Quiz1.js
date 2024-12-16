const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    questions: [{
        question: { 
            type: String, 
            required: true 
        },
        options: [{ 
            type: String, 
            required: true 
        }],
        answer: {
            type: Number, // Answer is stored as the index of the correct option
            required: true,
            validate: {
                validator: function(value) {
                    // Validate that the answer index is within the bounds of the options array
                    return value >= 0 && value < this.options.length;
                },
                message: 'Answer index must be within the range of available options.'
            }
        }
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model('Quiz', quizSchema);
