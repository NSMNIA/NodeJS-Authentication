const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const db = require('./models');

const app = express();

let allowedOrigins = [
    `${process.env.PRODUCTION_URL}`
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "crm_uid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 31,
    }
}))

// Routers
const userRouter = require('./routes/Users');
app.use("/auth", userRouter)

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.send({ success: 0, message: "No token found." })
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.send({ success: 0, message: "Token not valid." });
        req.userId = decoded.id;
        next();
    })
}

app.get('/api/isAuth', verifyJWT, (req, res) => {
    res.send({ success: 1, message: "User is authenticated" });
})

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Running on port 3001');
    })
})