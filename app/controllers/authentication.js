const passport = require('passport');
const User = require('../models/User');

module.exports.bulkRegister = async function(req, res, next) {
  try {
    const users = req.body;
    await Promise.all(users.map(async (userData) => {
      const user = new User();
      user.name = userData.name;
      user.username = userData.username;
      user.userrole = userData.userrole;
      user.grade = userData.grade;
      user.location = userData.location;
      user.course = userData.course;
      user.setPassword(userData.password);
      return user.save();
    }));
    res.status(201).json({ message: `${users.length} users registered successfully.` });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async function(req, res, next) {
  try {
    const user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.userrole = req.body.userrole;
    user.grade = req.body.grade;
    user.location = req.body.location;
    user.course = req.body.course;
    user.setPassword(req.body.password);
    await user.save();
    const token = user.generateJwt();
    res.status(201).json({ token, message: 'User registered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({ token, user });
    }
    return res.status(401).json(info);
  })(req, res);
};
