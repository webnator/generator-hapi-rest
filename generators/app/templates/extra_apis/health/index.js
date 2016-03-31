'use strict';

var Health = require('./healthController');

module.exports = function(server) {

  server.route({
    method: 'GET',
    path: '/health',
    config: {
      auth: false,
      tags: ['api', 'health'],
    },
    handler: function(request, reply, next) {
      Health.healthCheck(request, reply, next);
    }
  });

};
