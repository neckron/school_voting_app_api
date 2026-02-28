const express = require('express');
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');

const ctrlAuth = require('../controllers/authentication.js');
const ctrlVote = require('../controllers/voteController.js');
const ctrlCandidate = require('../controllers/candidateController.js');

const router = express.Router();
const routerProtect = express.Router();

// Shared validation error handler
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

// Validation chains
const validateLogin = [
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required'),
  handleValidation
];

const validateRegister = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
  body('userrole').isIn(['ADMIN', 'VOTER']).withMessage('userrole must be ADMIN or VOTER'),
  handleValidation
];

const validateVote = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('personVoteId').notEmpty().withMessage('personVoteId is required'),
  body('contrallorVoteId').notEmpty().withMessage('contrallorVoteId is required'),
  body('location').trim().notEmpty().withMessage('location is required'),
  handleValidation
];

const validateCandidate = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('candidatenumber').trim().notEmpty().withMessage('candidatenumber is required'),
  body('pictureURI').trim().notEmpty().withMessage('pictureURI is required'),
  body('type').isIn(['PERSONERO', 'BLANK_PERSONERO', 'CONTRALLOR', 'BLANK_CONTRALLOR'])
    .withMessage('type must be PERSONERO, BLANK_PERSONERO, CONTRALLOR, or BLANK_CONTRALLOR'),
  handleValidation
];

const validateBulkRegister = [
  body('*.name').trim().notEmpty().withMessage('name is required for each user'),
  body('*.username').trim().notEmpty().withMessage('username is required for each user'),
  body('*.password').isLength({ min: 6 }).withMessage('password must be at least 6 characters for each user'),
  body('*.userrole').isIn(['ADMIN', 'VOTER']).withMessage('userrole must be ADMIN or VOTER for each user'),
  handleValidation
];

// Public routes
router.post('/user/login', validateLogin, ctrlAuth.login);
router.post('/user/register', validateRegister, ctrlAuth.register);
router.get('/vote/alreadyVoted/:userid', ctrlVote.alreadyVoted);
router.get('/candidate/:type', ctrlCandidate.getCandidates);
router.get('/vote/results/contrallor', ctrlVote.resultsContrallor);
router.get('/vote/results/personero', ctrlVote.resultsPersonero);
router.get('/vote/results/general', ctrlVote.resultVotes);
router.get('/test', ctrlVote.prueba);
router.get('/vote/results/location', ctrlVote.resultsByLocation);
router.get('/vote/results/locationPerson', ctrlVote.resultsByLocationPerson);

// JWT authentication middleware for protected routes
routerProtect.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided.' });
  }
  try {
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
  }
});

// Protected routes
routerProtect.post('/user/vote', validateVote, ctrlVote.doVote);
routerProtect.post('/candidate/register', validateCandidate, ctrlCandidate.register);
routerProtect.post('/user/bulkRegister', validateBulkRegister, ctrlAuth.bulkRegister);

module.exports = { router, routerProtect };
