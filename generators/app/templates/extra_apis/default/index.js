'use strict';

var defaultController = require('./defaultController');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/default',
    config: {
      auth: false,
      tags: ['api', 'default'],
      description: 'Default get request'
    },
    handler: function(request, reply, next) {
      defaultController.getDefault(request, reply, next);
    }
  });

};
