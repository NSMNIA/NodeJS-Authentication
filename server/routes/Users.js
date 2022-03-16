const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { validateToken } = require('../middleware/AuthMiddleware');

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email: email } });
    if (user) return res.json({ success: 0, message: 'Email is already in use.' });
    bcrypt.hash(password, 11).then((hash) => {
        Users.create({
            email: email,
            password: hash,
            rid: 1
        });
        return res.json({ success: 1, message: "User is created." })
    })
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email: email } });
    if (!user) return res.json({ success: 0, message: 'User doens\'t exist' });

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) return res.json({ success: 0, message: "Wrong email/password combination." });
        const accessToken = jwt.sign({ email: user.email, uid: user.uid }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 31,
        });
        return res.json({ success: 1, message: 'User validated.', token: accessToken, user: { email: user.email, uid: user.uid } });
    });
});

router.get('/check', validateToken, (req, res) => {
    return res.json({ success: 1, message: 'User is authenticated', user: req.user });
})

module.exports = router;