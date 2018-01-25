// server.js

    // set up ========================
    var express  = require('express');
    // TODO var morgan = require('morgan');
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var jwt = require("jsonwebtoken");
    var path = require('path');
    require('dotenv').config();
    require('./app/configuration/dataBase');
    require('./app/configuration/passport');

    // routes ========================
   var routesApi = require('./app/routes/routes.js');
   var app = express();


    // configuration =================

    //app.use(express.static(path.join(__dirname, 'public')));        // set the static files location /public/img will be /img for users
  //  app.use(express.static(path.join(__dirname, 'client')));
	  // TODO  app.use(morgan('dev'));                                         // log every request to the console
    // TODO app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride()); //TODO what it is for?
    //app.use('/api', routesApi);


    app.use('/api', routesApi , function(req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', 'localhost:4200/');
     	res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'OPTIONS', 'DELETE');
    	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Authorization, Accept, x-access-token');
    	next();
    });
    module.exports = app;
