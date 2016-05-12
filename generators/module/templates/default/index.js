'use strict';

var <%= moduleName %>Controller = require('./controllers/<%= moduleName %>Controller');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/<%= moduleName %>',
    config: {
      auth: false,
      tags: ['api', '<%= moduleName %>'],
      description: 'Default <%= moduleName %> get request'
    },
    handler: <%= moduleName %>Controller.get<%= moduleNamePascal %>;
  });

};
