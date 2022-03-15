import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config'

const app = express();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.use(cors({
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3001, () => {
    console.log('Running on port 3001');
})