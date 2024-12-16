const mongoose = require('mongoose');
// No need for bcrypt if you're not hashing passwords right now
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/  // Email format validation
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {  // Optional field for user roles (e.g., admin, user)
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
}, { 
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Remove the password hashing logic for now
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();  // Only hash if the password is modified
//     try {
//         const salt = await bcrypt.genSalt(10);  // Generate salt
//         this.password = await bcrypt.hash(this.password, salt);  // Hash password
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Method to check if the entered password matches the hashed password in the database
// You don't need this for plain text passwords right now
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('User', userSchema);
