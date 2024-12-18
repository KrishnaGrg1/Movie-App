// routes/routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/url');
const {restrictToLoggedinUserOnly } = require('../middleware/auth');

// Authentication Routes
// Register Route
router.post('/register', register);

// Login Routes
router.get('/login', (req, res) => {
    res.render('login', { message: '' });
});
router.post('/login', login);

// Logout Route
router.get('/logout', (req, res) => {
    // Clear the session cookie
    res.clearCookie('uid');
    res.redirect('/login');
});

// Protected Routes
router.get('/home', restrictToLoggedinUserOnly, (req, res) => {
    res.render('home');
});

router.get('/contact', restrictToLoggedinUserOnly, (req, res) => {
    res.render('contact');
});

// Add other routes as needed
router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;