'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.<%= appUppercaseName %>_IP ||
    'localhost',

  // Server port
  port: process.env.<%= appUppercaseName %>_PORT ||
    8080,

  mongoSettings   : {
    "url": "mongodb://" + process.env.<%= appUppercaseName %>_MONGO_IP + ":" + process.env.<%= appUppercaseName %>_MONGO_PORT + "/" + process.env.<%= appUppercaseName %>_DDBB_NAME,
    "settings": {
      "db": {
        "native_parser": false
      }
    }
  },
  secretKey       : '<%= appName %>ApiSecretKey',
  salt            : '<%= appName %>s4ltv4lu3',
  loggerLevel     : process.env.<%= appUppercaseName %>_LOGLEVEL || 'debug',

};
