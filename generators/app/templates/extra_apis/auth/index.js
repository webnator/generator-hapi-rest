'use strict';

var Endpoint = require('./authController');

module.exports = function(server) {
  server.route({
    method: 'POST',
    path: '/auth',
    config: {
      auth: false,
      description: 'Get auth token'
    },
    handler: function(request, reply, next) {
      Endpoint.getToken(request, reply, next);
    }
  });

};
