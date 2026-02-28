const User = require('../models/User');
const Vote = require('../models/Vote');

exports.doVote = async function(req, res, next) {
  try {
    const vote = new Vote();
    vote.personVote = req.body.personVoteId;
    vote.contrallorVote = req.body.contrallorVoteId;
    vote.voteDate = new Date();
    vote.user = req.body.userId;
    vote.location = req.body.location;

    await vote.save();

    const doc = await User.findOne({ _id: req.body.userId }).exec();
    if (doc) {
      doc.vote = true;
      await doc.save();
    }

    res.status(200).json({ message: 'Vote registered successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.resultsContrallor = async function(req, res, next) {
  try {
    const result = await Vote.aggregate([
      { '$group': { '_id': '$contrallorVote', 'quantity': { '$sum': 1 } } },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate'
        }
      }
    ]).exec();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.resultsPersonero = async function(req, res, next) {
  try {
    const result = await Vote.aggregate([
      { '$group': { '_id': '$personVote', 'quantity': { '$sum': 1 } } },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate'
        }
      }
    ]).exec();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.resultVotes = async function(req, res, next) {
  try {
    const result = await User.aggregate([
      { '$group': { '_id': '$vote', 'quantity': { '$sum': 1 } } }
    ]).exec();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.alreadyVoted = async function(req, res, next) {
  try {
    const vote = await Vote.findOne({ user: req.params.userid }).exec();
    if (vote) {
      return res.status(200).json({ message: 'Ya ha votado!' });
    }
    return res.status(404).json({ message: 'No ha votado!' });
  } catch (err) {
    next(err);
  }
};

exports.prueba = function(req, res) {
  return res.status(200).json({ message: 'Funciona!' });
};

exports.resultsByLocation = async function(req, res, next) {
  try {
    const result = await Vote.aggregate([
      {
        $lookup: {
          from: 'candidates',
          localField: 'contrallorVote',
          foreignField: '_id',
          as: 'contrallorInfo'
        }
      },
      { '$unwind': '$contrallorInfo' },
      {
        $group: {
          _id: {
            location: '$location',
            contrallorVote: {
              '$concat': [
                '#',
                '$contrallorInfo.candidatenumber',
                ' - ',
                '$contrallorInfo.name',
                ' ',
                '$contrallorInfo.lastname'
              ]
            }
          },
          count: { '$sum': 1 }
        }
      },
      {
        $group: {
          _id: '$_id.location',
          votosContralores: {
            $push: {
              contralor: '$_id.contrallorVote',
              count: '$count'
            }
          }
        }
      }
    ]).exec();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.resultsByLocationPerson = async function(req, res, next) {
  try {
    const result = await Vote.aggregate([
      {
        $lookup: {
          from: 'candidates',
          localField: 'personVote',
          foreignField: '_id',
          as: 'personInfo'
        }
      },
      { '$unwind': '$personInfo' },
      {
        $group: {
          _id: {
            location: '$location',
            personVote: {
              '$concat': [
                '#',
                '$personInfo.candidatenumber',
                ' - ',
                '$personInfo.name',
                ' ',
                '$personInfo.lastname'
              ]
            }
          },
          count: { '$sum': 1 }
        }
      },
      {
        $group: {
          _id: '$_id.location',
          votosPersoneros: {
            $push: {
              personero: '$_id.personVote',
              count: '$count'
            }
          }
        }
      }
    ]).exec();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
