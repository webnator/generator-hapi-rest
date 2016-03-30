'use strict';

// Test specific configuration
// ==================================
module.exports = {
  ip              : 'localhost',
  port            : 9000,
  ddbbPort        : 27017,
  ddbbName        : '<%= appName %>',
  secretKey       : '<%= appName %>ApiSecretKey',
  salt            : '<%= appName %>s4ltv4lu3',

  mongoSettings   : {
      'url': 'mongodb://localhost:27017/<%= appName %>',
      'settings': {
          'db': {
              'native_parser': false
          }
      }
  }
};
