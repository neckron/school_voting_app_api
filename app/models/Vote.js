var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var voteSchema = new mongoose.Schema({
  personVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  contrallorVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
  },
  voteDate : {
    type : Date ,
    required : true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  }
});

//voteSchema.index({personVote:1, contrallorVote:1, user:1}, { unique: true });
module.exports = mongoose.model('Vote', voteSchema);
