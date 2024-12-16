const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Utility function for validating email format
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

// Sign Up
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Input validation
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }

    try {
        // Check if email or username already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        const user = new User({
            username,
            email,
            password: password // Store plain password (no hashing)
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        console.error('Error during sign up:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);  // Debugging: Log user lookup failure
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 2: Compare the plain text password with stored password
        console.log('Stored password:', user.password);  // Debugging: Log stored password
        console.log('Entered password:', password);  // Debugging: Log entered password

        if (password !== user.password) {
            console.log('Password mismatch for user:', email);  // Debugging: Log mismatch
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 3: Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


module.exports = router;
