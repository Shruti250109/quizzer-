const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const leaderboardRoutes = require('./routes/Leaderboard');

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);  // Authentication Routes
app.use('/api/quiz', quizRoutes);  // Quiz Routes
app.use('/api/leaderboard', leaderboardRoutes);  // Leaderboard Routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

// Default Route
app.get('/', (req, res) => res.send('Quiz App Backend'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

