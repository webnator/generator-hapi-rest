'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.<%= appPrefix %>_IP ||
    'localhost',

  // Server port
  port: process.env.<%= appPrefix %>_PORT ||
    8080,

  mongoSettings   : {
    "url": "mongodb://" + process.env.<%= appPrefix %>_MONGO_IP + ":" + process.env.<%= appPrefix %>_MONGO_PORT + "/" + process.env.<%= appPrefix %>_DDBB_NAME,
    "settings": {
      "db": {
        "native_parser": false
      }
    }
  },
  secretKey       : '<%= appName %>ApiSecretKey',
  salt            : '<%= appName %>s4ltv4lu3',
  loggerLevel     : process.env.<%= appPrefix %>_LOGLEVEL || 'debug',

};
