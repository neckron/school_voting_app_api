var mongoose = require('mongoose');
var User = require('../models/User');
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
  vote.location = req.body.location;

  vote.save(function(err) {
    if(err){
      res.status(400);
      res.json({
        "message" : err
      });
    }
    else {


      User.findOne({ _id: req.body.userId }, function (err, doc){
        doc.vote = true;
        doc.save();
      });

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

exports.resultVotes = function(req , res){
  User.aggregate([
         {"$group" : { "_id" : "$vote" , "quantity" : {"$sum" :1}}}
],
       function (err, result) {
         console.log(result)
           if (err) return handleError(err);
           return res.status(200).send(result);

       }
     )
}




exports.alreadyVoted = function(req , res){
  Vote.findOne({user : req.params.userid} , function(err,vote){
    if(vote){
      return res.status(200).send({massage : "Ya ha votado!"});
    }else{
      return res.status(404).send({massage : "No ha votado!"});
    }
})
}

exports.resultsByLocationPerson = function(req , res){
  Vote.aggregate([
    db.votes.aggregate([
      {
        $lookup: {
          from: "candidates",
          localField: "personVote",
          foreignField: "_id",
          as: "personeroInfo"
        }
      },
      {
        "$unwind": "$personeroInfo"
      },
      {
        $group: {
          _id: {
            location: "$location",
            personVote: {
              "$concat": [
                "#",
                "$personeroInfo.candidatenumber",
                " - ",
                "$personeroInfo.name",
                " ",
                "$personeroInfo.lastname"
              ]
            }
          },
          count: {
            "$sum": 1
          }
        }
      },
      {
        $group: {
          _id: "$_id.location",
          votosPersoneros: {
            $push: {
              personero: "$_id.personVote",
              count: "$count"
            }
          }
        }
      }
    ])
  ],
  function (err, result) {
      if (err) return handleError(err);
      return res.status(200).send(result);

  }
  );
}

exports.resultsByLocationContrallor = function(req , res){
  Vote.aggregate([
    {
      $lookup: {
        from: "candidates",
        localField: "contrallorVote",
        foreignField: "_id",
        as: "contrallorInfo"
      }
    },
    {
      "$unwind": "$contrallorInfo"
    },
    {
      $group: {
        _id: {
          location: "$location",
          contrallorVote: {
            "$concat": [
              "#",
              "$contrallorInfo.candidatenumber",
              " - ",
              "$contrallorInfo.name",
              " ",
              "$contrallorInfo.lastname"
            ]
          }
        },
        count: {
          "$sum": 1
        }
      }
    },
    {
      $group: {
        _id: "$_id.location",
        votosContraloers: {
          $push: {
            contralor: "$_id.contrallorVote",
            count: "$count"
          }
        }
      }
    }
]),
  function (err, result) {
      if (err) return handleError(err);
      return res.status(200).send(result);

  }
}
