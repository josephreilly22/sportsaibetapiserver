const express = require('express');
const app = express();

// Enviroment Variables
const dotenv = require('dotenv');
dotenv.config();

// Port
const PORT = process.env.PORT;

// Middleware Imports
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet');
const session = require('express-session');

// Database Imports
const { getMLBToday, getNFLToday, getMLBYesterday, getMLBResults } = require('./webdb.js');

// Login Imports 
require('./googleoauth.js');

// Routes 
const authRoute = require('./auth.js');
const cookieSession = require('cookie-session');

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.set('trust proxy', 1);
app.use(
    cookieSession({
        name: 'session', 
        keys: [process.env.SESSION_SECRET1, process.env.SESSION_SECRET2, process.env.SESSION_SECRET3], 
        maxAge: 4 * 24 * 60 * 60 * 1000,
        secret: 'secretkey',
        sameSite: 'none'
    })
);
// app.use(session({ 
//     secret: "lama",
//     resave: false,
//     saveUninitialized: false,
//     name: 'session',
//     proxy: true,
//     cookie: { 
//         secure: true,
//         maxAge: 86400000,
//         sameSite: "none"
//     }
// }))

app.use(passport.initialize());
app.use(passport.session());

// Test
app.get('/test' , (req, res) => {
    res.sendStatus(200);
})

// MLB
app.get('/mlbtoday', getMLBToday);
app.get('/mlbyesterday', getMLBYesterday);
app.get('/results', getMLBResults);

// NFL
app.get('/nfltoday', getNFLToday);

// Account 
app.use('/auth', authRoute) 


// Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})