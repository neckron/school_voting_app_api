var express = require('express');
var ctrlAuth = require('../controllers/authentication.js');
var ctrlVote = require('../controllers/voteController.js');
var ctrlCandidate = require('../controllers/candidateController.js');
var jwt = require('jsonwebtoken');

var router = express.Router();
var routerProtect = express.Router();

router.post('/user/login', ctrlAuth.login);
router.get('/candidate/:type', ctrlCandidate.getCandidates);
//router.get('/polls' ,PollsCtrl.findPolls);
//router.get('/poll/:id' ,PollsCtrl.findPollById);
//router.put('/polls/:id',PollsCtrl.updatePoll);

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
//router.route('/polls').post(PollsCtrl.createPoll);
//router.route('/polls/:id').delete(PollsCtrl.deletePoll);
//router.route('/polls/:username').get(PollsCtrl.findUserPolls);
//router.get('/user/profile/:username', ctrlProfile.profileRead);

module.exports = {
  router , routerProtect 
}
