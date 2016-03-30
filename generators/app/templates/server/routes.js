/**
 * Main application routes
 */

'use strict';

exports.register = function(server, options, next) {

  require('./api/auth')(server);

  require('./api/default')(server);

  /* Required API endpoints */
  require('./api/health')(server);

  next();
};

exports.register.attributes = {
  name: '<%= appName %>-routes',
  version: '0.0.1'
};
