import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const saltRounds = 10;

const app = express();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

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

app.post('/api/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkIfUserExist = 'SELECT * FROM `users` WHERE `email` = ? LIMIT 1';
    db.query(checkIfUserExist,
        [email],
        (err,result)=> {
            if(err) return res.send({success: 0, message: err});
            if(result.length >= 1) return res.send({success: 0, message: "Email address already in use."});
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err) return res.send({success: 0, message: err})
                const sqlQuery = "INSERT INTO `users` (`email`, `password`, `role`) VALUES (?,?,1)";
                db.query(sqlQuery,
                    [email, hash],
                    (err, result)=> {
                        if(err) return res.send({success: 0, message: err});
                        if(!result) return res.send({success: 0, message: "Something went wrong. Please try again later."})
                        return res.send({success: 1, message: `User '${email}' has been added.`});
                    }
                );
            })
        }
    );
});

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sqlQuery = "SELECT * FROM `users` WHERE `email` = ? LIMIT 1";
    db.query(sqlQuery,
        [email],
        (err,result) => {
            if(err) return res.send({success: 0, message: err});
            if(!result.length > 0) return res.send({success: 0, message: "User doesn't exist."})

            bcrypt.compare(password, result[0].password, (error, response) => {
                if(error) return res.send({success: 0, message: error});
                if (!response) return res.send({ success: 0, message: "Wrong email/password combination."});
                const id = result[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: 300,
                });
                delete result[0].password
                req.session.user = result;
                return res.json({success: 1, message: 'User validated.', token: token, result: result});
            });
        });
})

const verifyJWT = (req,res,next) => {
    const token = req.headers['x-access-token'];
    if(!token) return res.send({success: 0, message: "No token found."})
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.send({success: 0, message: "Token not valid."});
        req.userId = decoded.id;
        next();
    })
}

app.get('/api/isAuth', verifyJWT, (req, res) => {
    res.send({success: 1, message: "User is authenticated"});
})

// app.get('/api/login', (req, res)=> {
//     if(!req.session.user) return res.send({loggedIn: false});
//     return res.send({
//             loggedIn: true,
//             user: req.session.user
//         });
// })

app.listen(3001, () => {
    console.log('Running on port 3001');
})