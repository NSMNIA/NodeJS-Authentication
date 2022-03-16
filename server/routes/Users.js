const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

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
        const id = match.id;
        delete match.password;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 31,
        });
        req.session.user = match;
        return res.json({ success: 1, message: 'User validated.', token: token, result: match });
    });
});

module.exports = router;