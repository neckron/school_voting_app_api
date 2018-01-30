var express = require('express');
var ctrlAuth = require('../controllers/authentication.js');
var ctrlVote = require('../controllers/voteController.js');
var ctrlCandidate = require('../controllers/candidateController.js');
var jwt = require('jsonwebtoken');

var router = express.Router();
var routerProtect = express.Router();

router.post('/user/login', ctrlAuth.login);
router.get('/vote/alreadyVoted/:userid', ctrlVote.alreadyVoted);
router.get('/candidate/:type', ctrlCandidate.getCandidates);
router.get('/vote/results/contrallor', ctrlVote.resultsContrallor);
router.get('/vote/results/personero', ctrlVote.resultsPersonero);
router.get('/vote/results/general', ctrlVote.resultVotes);
//router.get('/vote/alreadyVoted', ctrlVote.alreadyVoted);



routerProtect.use(function(req, res, next) {
 console.log('enter route use');
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'MY_SECRET', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

routerProtect.post('/user/register', ctrlAuth.register);
routerProtect.post('/user/vote', ctrlVote.doVote);
routerProtect.post('/candidate/register', ctrlCandidate.register);
routerProtect.post('/user/bulkRegister', ctrlAuth.bulkRegister);


module.exports = {
  router , routerProtect
}
