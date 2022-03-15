import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import 'dotenv/config'

const saltRounds = 10;

const app = express();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

var allowedOrigins = [
    `${process.env.ORIGIN}`
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkIfUserExist = 'SELECT * FROM `users` WHERE `email` = ? LIMIT 1';
    db.query(checkIfUserExist,
        [email],
        (err,result)=> {
            if(err) return res.send({success: 0, message: err});
            if(result.length >= 1) return res.send({success: 0, message: "Email already in use."});
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err) return res.send({success: 0, message: err})
                const sqlQuery = "INSERT INTO `users` (`email`, `password`, `role`) VALUES (?,?,1)";
                db.query(sqlQuery,
                    [email, hash],
                    (err, result)=> {
                        if(err) return res.send({success: 0, message: err});
                        if(!result) return res.send({success: 0, message: "Wrong combination."})
                        return res.send({success: 1, message: 'User has been added.'});
                    }
                );
            })
        }
    );
})

app.listen(3001, () => {
    console.log('Running on port 3001');
})