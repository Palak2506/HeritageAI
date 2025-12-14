// Backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Get the secret key (MUST be set in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_jwt_secret'; 

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

// ===================================
// 1. REGISTER ROUTE (POST /api/auth/register)
// ===================================
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        user = new User({ email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({ 
            token, 
            user: { id: user._id, email: user.email } 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during registration');
    }
});

// ===================================
// 2. LOGIN ROUTE (POST /api/auth/login)
// ===================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = generateToken(user._id);

        res.json({ 
            token, 
            user: { id: user._id, email: user.email } 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
});

module.exports = router;