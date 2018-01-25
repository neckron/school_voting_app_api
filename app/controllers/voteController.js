var mongoose = require('mongoose');
//var User = require('../models/User');
var Vote = require('../models/Vote');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.doVote = function(req, res) {

  console.log(req.body);

  var vote = new Vote();
  vote.personVote = req.body.personVoteId;
  vote.contrallorVote = req.body.contrallorVoteId;
  vote.voteDate = new Date();
  vote.user = req.body.userId;

  vote.save(function(err) {
    if(err){
      res.status(400);
      res.json({
        "message" : err
      });
    }
    else {
    res.status(200);
    res.json({
      "message" : "Vote registered successfully."
    });
  }
  });

};
