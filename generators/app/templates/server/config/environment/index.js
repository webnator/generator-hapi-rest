'use strict';

var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.<%= appUppercaseName %>_NODE_ENV,
  host: process.env.<%= appUppercaseName %>_IP || 'localhost',
  appName: '<%= appName %>',
  routes: {
    prefix: '/v1/<%= appName %>'
  },
  salt: '<%= appName %>s4ltv4lu3'
};

console.log('Runing in ', process.env.<%= appUppercaseName %>_NODE_ENV, 'mode');

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.<%= appUppercaseName %>_NODE_ENV) || {});
