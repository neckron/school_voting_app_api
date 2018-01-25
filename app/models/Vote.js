var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var voteSchema = new mongoose.Schema({
  personVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required : true
  },
  contrallorVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required : true
  },
  voteDate : {
    type : Date ,
    required : true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true,
    unique :true
  }
});

module.exports = mongoose.model('Vote', voteSchema);
