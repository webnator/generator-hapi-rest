'use strict';
var crypto  = require('crypto');
var uuid    = require('uuid');
var config  = require('../../../config/environment');

function User(userData) {
  var user = {
    email           : userData.email,
    password        : crypto.createHash('sha256').update(userData.password + config.salt, "utf8").digest('base64'),
    uuid            : uuid.v4(),
    dateCreated     : new Date(),
    application     : userData.application
  }
  return user;
}

module.exports = User;
