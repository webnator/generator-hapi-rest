/**
 * Main application file
 */
'use strict';
// Set default node environment to development
process.env.<%= appPrefix %>_NODE_ENV = process.env.<%= appPrefix %>_NODE_ENV || 'local';

var Hapi          = require('hapi');
var config        = require('./config/environment');
var GlobalModule  = require('./components/global.js');
<% if (usesAuth) { %>var hapiAuthJWT   = require('hapi-auth-jwt2');
var authC         = require('./api/auth/authController');<% } %>

// Create a server with a host and port
var server;
<% if (usesAuth) { %>
var setAuthStrategy = function () {
  server.auth.strategy('jwt', 'jwt', true,
    { key: config.secretKey,
      validateFunc: authC.isAuthenticated,
      verifyOptions: {
        ignoreExpiration: false,
        //expiresIn:
        algorithms: ['HS256']
      }
    });
};
<% } %>

var setOptions = function () {
  var opts = {};
  opts.routes = {prefix: config.routes.prefix};
  return opts;
};


var init = function () {
  return new Promise((resolve, reject) => {
    // Create a server with a host and port
    server = new Hapi.Server();
    server.connection({port: config.port, routes: {cors: true}});
    // JWT Auth Strategy
  <% if (usesAuth) { %>
    server.register(hapiAuthJWT, function (err) {
      if (err) {
        return reject(err);
      }
      setAuthStrategy();
    });
  <% } %>
    // Register the server and start the application
    server.register(
      [
        {register: require('./routes')},
        {register: require('hapi-mongodb'), options: config.mongoSettings},
        {register: require('inert')},
        {register: require('vision')}
      ],
      setOptions(),
      function (err) {
        if (err) {
          return reject(err);
        }
        server.start(function (err) {
          if (err) {
            return reject(err);
          }
          GlobalModule.setConfigValue('db', server.plugins['hapi-mongodb'].db);
          return resolve(server);
        });
      }
    );
  });
};

var stopServer = function() {
  return new Promise((resolve, reject) => {
    GlobalModule.getConfigValue('db').close();
    server.stop(function (err) {
      if (err) {
        return reject(err);
      }
      console.log('Server stopped');
      return resolve(server);
    });
  });
};

exports.init = init;
exports.stopServer = stopServer;
