'use strict';

var <%= moduleName %>Controller = require('./<%= moduleName %>Controller');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/<%= moduleName %>',
    config: {
      auth: false,
      tags: ['api', '<%= moduleName %>'],
      description: 'Default <%= moduleName %> get request'
    },
    handler: function(request, reply, next) {
  <%= moduleName %>Controller.get<%= moduleNamePascal %>(request, reply, next);
    }
  });

};
