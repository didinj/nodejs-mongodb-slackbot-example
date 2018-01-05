var slackbot = require('./helpers/bot'); // import slackbot library
var mongoose = require('mongoose');  // import mongoose library for accessing MongoDB
var http = require('http');
http.createServer((req, res) => {}).listen(1337, '127.0.0.1');

/* Create MongoDB Connection */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/slackbot', { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

slackbot.run();
