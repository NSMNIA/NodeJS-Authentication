const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv/config');
const db = require('./models');

global.__basedir = __dirname;

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
app.use(express.static('resources/static/assets'))
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

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Running on port 3001');
    })
})