import dotenv from "dotenv";
dotenv.config()

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile); // Send user data to session
    }
  )
);

// Serialize user (store user in session)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser((user, done) => {
  done(null, user);
});
