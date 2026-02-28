const mongoose = require('mongoose');

const CANDIDATETYPE = ['PERSONERO', 'BLANK_PERSONERO', 'CONTRALLOR', 'BLANK_CONTRALLOR'];

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  lastname: {
    type: String,
    required: false,
    unique: false
  },
  candidatenumber: {
    type: String,
    required: true,
    unique: true
  },
  grade: {
    type: String,
    required: false
  },
  pictureURI: {
    type: String,
    required: true
  },
  proposals: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true,
    enum: CANDIDATETYPE
  }
}, { timestamps: true });

candidateSchema.index({ type: 1, candidatenumber: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);
