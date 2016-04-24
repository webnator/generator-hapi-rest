'use strict';
var crypto  = require('crypto');
var uuid    = require('uuid');
var config  = require('../../../config/environment');

function <%= moduleNamePascal %>(<%= moduleName %>Data) {
  return {
    email           : <%= moduleName %>Data.name,
    password        : crypto.createHash('sha256').update(<%= moduleName %>Data.password + config.salt, 'utf8').digest('base64'),
    uuid            : uuid.v4(),
    dateCreated     : new Date()
  };
}

module.exports = <%= moduleNamePascal %>;
