const { verify } = require('jsonwebtoken');
require('dotenv/config');

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken');
    console.log(accessToken);
    if (!accessToken) return res.json({ success: 0, message: "User not logged in." });

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (!validToken) return res.json({ success: 0, message: "Not a valid token." })
        return next();
    } catch (err) {
        return res.json({ success: 0, message: err });
    }
}

module.exports = { validateToken };