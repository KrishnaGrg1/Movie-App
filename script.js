const express = require('express');
const app = express();
const path = require('path');
const port = 8000;
const { connecttoMongoDB } = require('./connect');
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const { restrictToLoggedinUserOnly } = require('./middleware/auth');
const { getUserId } = require('./services/auth');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Routes
app.use('/', router);

app.get('/register', (req, res) => {
    res.render('register', { message: '' });
});

app.get('/login', (req, res) => {
    res.render('login', { message: '' });
});

app.get('/home', restrictToLoggedinUserOnly, (req, res) => {
    res.render('home');
});

app.get('/contact', restrictToLoggedinUserOnly, (req, res) => {
    res.render('contact');
});

app.get('/logout', (req, res) => {
    const sessionId = req.cookies?.uid;
    if (sessionId) {
        // Clear server-side session
        const sessionIdToUserMap = require('./service/auth');
        sessionIdToUserMap.delete(sessionId);
        // Clear client-side cookie
        res.clearCookie('uid');
    }
    res.redirect('/login');
});

// MongoDB connection
connecttoMongoDB('mongodb://127.0.0.1:27017/movie')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});