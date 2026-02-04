const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Login Route
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log(`[LOGIN DEBUG] Attempting login for: ${email}`);

    if (!user) {
      console.log('[LOGIN DEBUG] User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('[LOGIN DEBUG] User found:', user._id);
    console.log('[LOGIN DEBUG] Stored hash:', user.password);

    // Verify password
    const isMatch = await user.comparePassword(password);
    console.log(`[LOGIN DEBUG] Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log('[LOGIN DEBUG] Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('[LOGIN DEBUG] Login successful');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
