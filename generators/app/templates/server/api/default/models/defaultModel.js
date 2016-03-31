'use strict';
var crypto  = require('crypto');
var uuid    = require('uuid');
var config  = require('../../../config/environment');

function Default(defaultData) {
  var data = {
    email           : defaultData.name,
    password        : crypto.createHash('sha256').update(defaultData.password + config.salt, "utf8").digest('base64'),
    uuid            : uuid.v4(),
    dateCreated     : new Date()
  }
  return data;
}

module.exports = Default;
