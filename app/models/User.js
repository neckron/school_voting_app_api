const mongoose = require('mongoose');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');

const USERTYPE = ['ADMIN', 'VOTER'];
const PBKDF2_ITERATIONS = 210000;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    unique: true,
    type: String,
    required: true
  },
  userrole: {
    type: String,
    enum: USERTYPE,
    required: true
  },
  grade: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  course: {
    type: String,
    required: false
  },
  vote: {
    type: Boolean,
    required: false
  },
  hash: String,
  salt: String
}, { timestamps: true });

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('User', userSchema);
