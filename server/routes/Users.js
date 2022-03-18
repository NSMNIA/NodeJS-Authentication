const express = require('express');
const router = express.Router();
const { Users, Roles } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { validateToken } = require('../middleware/AuthMiddleware');
const { mailer } = require('../functions/Mailer');
const { generateToken } = require('../functions/GenerateToken');

router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    await Users.findOne({ where: { email: email } }).then(user => {
        if (user) return res.json({ success: 0, message: 'Email is already in use.' });
        bcrypt.hash(password, 11).then((hash) => {
            Users.create({
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: hash,
                rid: 1
            });
            return res.json({ success: 1, message: "User is created." })
        })
    }).catch(err => {
        console.error(err);
        return res.json({ success: 0, message: err });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await Users.findOne({ where: { email: email } }).then(user => {
        if (!user) return res.json({ success: 0, message: 'User doens\'t exist.' });
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) return res.json({ success: 0, message: "Wrong email/password combination." });
            const accessToken = jwt.sign({ email: user.email, uid: user.uid }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24 * 31,
            });
            return res.json({ success: 1, message: 'User validated.', token: accessToken, user: { email: user.email, uid: user.uid } });
        });
    }).catch(err => {
        console.error(err);
        return res.json({ success: 0, message: err });
    });
});

router.get('/check', validateToken, (req, res) => {
    return res.json({ success: 1, message: 'User is authenticated.', user: req.user });
})

router.get('/profile', validateToken, async (req, res) => {
    await Users.findOne({
        include: [Roles],
        where: {
            email: req.user.email,
            uid: req.user.uid
        }
    }).then((user) => {
        if (!user) return res.json({ success: 0, message: 'User doens\'t exist.' });
        user.password = undefined;
        return res.json({ success: 1, message: 'Succeeded with fetching data.', user: user });
    }).catch(err => {
        console.error(err);
        return res.json({ success: 0, message: err });
    });
});

router.post('/password/change', validateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await Users.findOne({ where: { email: req.user.email } }).then(user => {
        if (!user) return res.json({ success: 0, message: 'User doens\'t exist.' });
        bcrypt.compare(currentPassword, user.password).then(async match => {
            if (!match) return res.json({ success: 0, message: "Wrong password entered." });
            bcrypt.hash(newPassword, 11).then(async hash => {
                await Users.update({ password: hash }, { where: { email: req.user.email } }).then(updated => {
                    if (!updated) return res.json({ success: 0, message: "Something went wrong, try again later." });
                    return res.json({ success: 1, message: "Password has been updated." });
                })
            })
        })
    })
});

router.post('/password/forgot', async (req, res) => {
    const { email } = req.body;
    await Users.findOne({ where: { email: email } }).then(user => {
        if (!user) return res.json({ success: 0, message: 'Email doens\'t exist.' });
        const rememberToken = generateToken(69);
        Users.update({remember_token: rememberToken}, {where: { email: email}}).then(updated => {
            if(!updated) return res.json('Something went wrong, try again later.');
            mailer(email, 'Password Reset', 'Please reset your password', `<b>Reset your password <a target="_blank" href="${process.env.PRODUCTION_URL}/password/reset/${rememberToken}">Reset your password</a></b>`).then((response) => {
                if (response.success === 0) return res.send({ success: 0, message: 'Something went wrong, try again later.' });
                return res.send({ success: 1, message: 'Email has been sent.' });
            })
        })
    })
});

router.post('/password/reset', async (req, res)=> {
    const {remember_token, email, password} = req.body;
    await Users.findOne({where: {
        email: email,
        remember_token: remember_token
    }}).then(user => {
        if(!user) return res.json({success: 0, message: "Email or remember token is invalid."});
        bcrypt.hash(password, 11).then(async hash => {
            await Users.update({ password: hash, remember_token: null }, { where: { email: email, remember_token: remember_token } }).then(updated => {
                if (!updated) return res.json({ success: 0, message: "Something went wrong, try again later." });
                return res.json({ success: 1, message: "Your password has been reset successfully." });
            })
        })
    })
})

module.exports = router;