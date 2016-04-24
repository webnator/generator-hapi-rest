/**
 * Main application routes
 */

'use strict';

exports.register = function(server, options, next) {
  <% if (usesAuth) { %>
  require('./api/auth')(server);
  <% } %>
  /* Required API endpoints */
  <% if (usesHealth) { %>
  require('./api/health')(server);
  <% } %>

  /* routesinject */

  next();
};

exports.register.attributes = {
  name: '<%= appName %>-routes',
  version: '0.0.1'
};
