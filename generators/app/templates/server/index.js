'use strict';

var app = require('./app.js');

app.init().then(function(server) {
  console.log('Server running at', server.info.uri);
}, function(err) {
  console.log('Server start error',  err);
});
