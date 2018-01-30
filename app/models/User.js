var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;
const USERTYPE = ['ADMIN','VOTER']

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username : {
    unique : true,
    type : String ,
    required : true
  },
  userrole : {
    type: String,
    enum : USERTYPE,
    required : true
  },
  grade : {
    type : String,
    required : false
  },
  location : {
    type : String,
    required : false
  },
  course : {
    type : String,
    required : false
  },
  vote :{
    type : Boolean,
    required : false
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('User', userSchema);
