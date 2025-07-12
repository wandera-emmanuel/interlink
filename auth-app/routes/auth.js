const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('.../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const { authenticateJWT, authorizeRole } = require('../middleware/auth');

router.get('/admin', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

// Login
router.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: req.user._id, username: req.user.username, role: req.user.role } });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;