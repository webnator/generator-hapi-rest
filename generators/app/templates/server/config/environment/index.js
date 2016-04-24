'use strict';

var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.<%= appPrefix %>_NODE_ENV,
  host: process.env.<%= appPrefix %>_IP || 'localhost',
  appName: '<%= appName %>',
  routes: {
    prefix: '/v1/<%= appName %>'
  },
  salt: '<%= appName %>s4ltv4lu3'
};

console.log('Runing in ', process.env.<%= appPrefix %>_NODE_ENV, 'mode');

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.<%= appPrefix %>_NODE_ENV) || {});
