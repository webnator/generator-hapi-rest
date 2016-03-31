'use strict';

var authResponses   = require('./authResponses');
var GlobalModule    = require('../../components/global');
var mongo           = require('mongodb');
var config          = require('../../config/environment');
var Q               = require('q');
var Utils           = require('../../components/utils');
var jwt             = require('jsonwebtoken');
var crypto          = require('crypto');
var log             = Utils.log;

var USERS_NAME_COLLECTION = 'users';

exports.checkUserCredentials = function(data){
  var deferred = Q.defer();
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var credentials = {
    email: data.payload.email,
    password: crypto.createHash('sha256').update(data.payload.password + config.salt, "utf8").digest('base64')
  };

  colUser.findOne(credentials, function(err, userData){
    if(err){
      log('error', data.logData, "checkUserCredentials (Promise) KO");
      deferred.reject(authResponses.internal_ddbb_error);
    } else {
      if(userData){
          var userSign = {
            email: userData.email,
            uuid: userData.uuid
          };
          data.token = jwt.sign(userSign, config.secretKey);
          log('info', data.logData, "checkUserCredentials (Promise)OK");
          deferred.resolve(data);
      } else {
        log('error', data.logData, "checkUserCredentials (Promise) KO");
        deferred.reject(authResponses.user_credentials_ko);
      }
    }
  });

  return deferred.promise;
};
