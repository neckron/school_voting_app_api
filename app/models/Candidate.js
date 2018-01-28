var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
const CANDIDATETYPE = ['PERSONERO','BLANK_PERSONERO','CONTRALLOR','BLANK_CONTRALLOR']

var candidateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique : false
  },
  lastname : {
    type: String,
    required: false,
    unique : false
  },
  candidatenumber : {
    type: String,
    required: true,
    unique : true
  },
  grade : {
    type : String,
    required : false
  },
  pictureURI: {
    type: String,
    required: true
  },
  proposals : {
    type : String ,
    required : false
  },
  type :{
    type : String ,
    required : true ,
    enum : CANDIDATETYPE
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
