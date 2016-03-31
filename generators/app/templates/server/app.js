/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.<%= appPrefix %>_NODE_ENV = process.env.<%= appPrefix %>_NODE_ENV || 'development';

var Hapi          = require('hapi');
var config        = require('./config/environment');
var GlobalModule  = require('./components/global.js');
var hapiAuthJWT   = require('hapi-auth-jwt2');
var JWT           = require('jsonwebtoken');
var authC         = require('./api/auth/authController');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({port: config.port , routes: { cors: true }});

// JWT Auth Strategy
server.register(hapiAuthJWT, function (err) {
  server.auth.strategy('jwt', 'jwt', true,
  { key: config.secretKey,
    validateFunc: authC.isAuthenticated,
    verifyOptions: {
      ignoreExpiration: false,
      //expiresIn:
      algorithms: ['HS256']
    }
  });
});

// Register the server and start the application
server.register([
    {register: require('./routes')},
    {register: require('hapi-mongodb'),options: config.mongoSettings},
    {register: require('inert')},
    {register: require('vision')}
  ],
  {routes: {prefix: config.routes.prefix}},

  function(err) {
    if (err) throw err;
    server.start(function() {
      console.log('Server running at', server.info.uri);
      GlobalModule.setConfigValue('db', server.plugins['hapi-mongodb'].db);
    })
  }
);
