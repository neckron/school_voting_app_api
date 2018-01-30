var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/User');
var crypto = require('crypto');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.bulkRegister = function(req, res) {
   var x = 0 ;
   var y  = 0;
  var arrayl = req.body;
 for(var i = 0; i < arrayl.length; i++){
   var user = new User();
   user.name = arrayl[i].name;
   user.username = arrayl[i].username;
   user.userrole = arrayl[i].userrole;
   user.grade = arrayl[i].grade;
   user.location = arrayl[i].location;
   user.course = arrayl[i].course;
   user.setPassword(arrayl[i].password);
   user.save(function() {
     if(err){
       console.log(err);

     }
 });
 }
 console.log("guardados: "+ x);
 console.log("no guardados: "+ y)
}

module.exports.register = function(req, res) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.userrole = req.body.userrole;
  user.grade = req.body.grade;
  user.location = req.body.location;
  user.course = req.body.course;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if(err){
      res.json({
        "message" : err
      });
    }
    else{var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token ,
      "message" : "User registered successfully."
    });
  }
  });

};

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token;
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found

    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token ,
        "user" : user
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
