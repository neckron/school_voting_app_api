var mongoose = require('mongoose');
//var User = require('../models/User');
var Candidate = require('../models/Candidate');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  var candidate = new Candidate();
  candidate.name = req.body.name;
  candidate.lastname = req.body.lastname;
  candidate.candidatenumber = req.body.candidatenumber;
  candidate.grade = req.body.grade;
  candidate.pictureURI = req.body.pictureURI;
  candidate.proposals = req.body.proposals;
  candidate.type = req.body.type;

  candidate.save(function(err) {
    if(err){
      res.status(400);
      res.json({
        "message" : err
      });
    }
    else {
    res.status(200);
    res.json({
      "message" : "Candidate registered successfully."
    });
  }
  });
};

module.exports.getCandidates = function(req, res){
  var type = req.params.type;
  return getCandidatesByType(req, res, type)
};

function getCandidatesByType(req,res ,type){
  Candidate.find({"type" : type} , (err, candidates) => {
      if(err){
        res.status(500).send(err);
      }else if(candidates.length > 0){
        res.status(200).send(candidates);
      }else{
        res.status(400);
        res.json({"message" : "No candidates found"})

      }
  });
}
