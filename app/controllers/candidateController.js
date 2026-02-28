const Candidate = require('../models/Candidate');

module.exports.register = async function(req, res, next) {
  try {
    const candidate = new Candidate();
    candidate.name = req.body.name;
    candidate.lastname = req.body.lastname;
    candidate.candidatenumber = req.body.candidatenumber;
    candidate.grade = req.body.grade;
    candidate.pictureURI = req.body.pictureURI;
    candidate.proposals = req.body.proposals;
    candidate.type = req.body.type;
    await candidate.save();
    res.status(201).json({ message: 'Candidate registered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports.getCandidates = function(req, res, next) {
  const type = req.params.type;
  return getCandidatesByType(req, res, next, type);
};

async function getCandidatesByType(req, res, next, type) {
  try {
    const candidates = await Candidate.find({ type }).sort({ candidatenumber: 'asc' }).exec();
    if (candidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found' });
    }
    res.status(200).json(candidates);
  } catch (err) {
    next(err);
  }
}
