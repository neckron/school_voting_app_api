// server.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

require('./app/configuration/dataBase');
require('./app/configuration/passport');

// CORS configuration
const origins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:4200',
      'http://192.168.0.91:4200',
      'https://elections-afl-front.herokuapp.com'
    ];

const app = express();

app.use(cors({ origin: origins, optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));
app.options('/*splat', cors({ origin: origins }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

// routes
const routesApi = require('./app/routes/routes.js');
app.use('/api', routesApi.router);
app.use('/api', routesApi.routerProtect);

// Global error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

module.exports = app;
