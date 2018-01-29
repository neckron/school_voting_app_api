var mongoose = require('mongoose');
//var User = require('../models/User');
var Vote = require('../models/Vote');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.doVote = function(req, res) {

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

exports.resultsContrallor = function(req , res){
  var vote = new Vote();
        Vote.aggregate([
          {"$group" : {"_id":"$contrallorVote", "quantity":{"$sum":1}}},
          { $lookup:
           {
             from: "candidates",
             localField: "_id",
             foreignField: "_id",
             as: "candidate"
           }
      },
        ],
        function (err, result) {
            if (err) return handleError(err);
            return res.status(200).send(result);

        }
        );
}

exports.resultsPersonero = function(req , res){
  var vote = new Vote();
        Vote.aggregate([
          {"$group" : {"_id":"$personVote", "quantity":{"$sum":1}}},
          { $lookup:
           {
             from: "candidates",
             localField: "_id",
             foreignField: "_id",
             as: "candidate"
           }
      },
        ],
        function (err, result) {
            if (err) return handleError(err);
            return res.status(200).send(result);

        }
        );
}
