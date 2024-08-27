const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;

// DB
const { checkForUser, addUser } = require('./webdb.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api.sportsaibet.com/auth/google/callback"
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const user = await checkForUser(profile.id);
    if (user == null) {
        await addUser(profile.id, profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.photos[0].value)
    }
    done(null, profile);
  }
))

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})