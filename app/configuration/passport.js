const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'username'
},
async function(username, password, done) {
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return done(null, false, { message: 'User not found', status: 401 });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Password is wrong', status: 401 });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
