const express = require('express')
const router = express.Router();
const passport = require('passport');

const { logout } = require('./login.js');
const { checkForUser, changePreference } = require('./webdb.js');
require('./googleoauth.js');


router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile']})
);

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: 'https://www.sportsaibet.com/account', 
        failureRedirect: 'https://www.sportsaibet.com/failure'
    })
);

router.get('/login/success', async (req, res) => {
    if (req.user) {
        const person = await checkForUser(req.user.id);
        res.json({person})
    } else {
        res.sendStatus(401);
    }
});

router.post('/preference/change', async (req, res) => {
    if (req.user) {
        await changePreference(req.user.id, req.body.preference);
        res.json({'status': 'success'})
    } else {
        res.sendStatus(401);
    }
})

router.get('/failure', (req, res) => {
    res.json({"status": "error logging in"})
})

router.get('/logout', logout)

module.exports = router;