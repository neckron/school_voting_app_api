const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('::: Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('::: Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('::: Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
const gracefulShutdown = async (msg) => {
  await mongoose.connection.close();
  console.log('::: Mongoose disconnected through ' + msg);
};

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart').then(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination').then(() => {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination').then(() => {
    process.exit(0);
  });
});
