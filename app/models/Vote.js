const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  personVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  contrallorVote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  voteDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, { timestamps: true });

voteSchema.index({ location: 1 });
voteSchema.index({ contrallorVote: 1 });
voteSchema.index({ personVote: 1 });

module.exports = mongoose.model('Vote', voteSchema);
