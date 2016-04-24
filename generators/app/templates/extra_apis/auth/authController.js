'use strict';

var config        = require('../../config/environment');
var jwt           = require('jsonwebtoken');
var Errors        = require('../../components/errors');
var Utils         = require('../../components/utils');
var AuthModelJoi  = require('./models/authModelJoi');
var authResponses = require('./authResponses');
var _authUtils    = require('./authUtils');
var log           = Utils.log;

exports.getToken = function(request, reply) {
  var data = {
    logData  : Utils.logData(request),
    schema  : new AuthModelJoi(),
    payload : request.payload
  };
  var response;
  log('info', data.logData, 'getToken Accessing');

  Utils.validateSchema(data)
    .then(_authUtils.checkUserCredentials)
    .then(function(){
      response = Utils.createResponseData(authResponses.user_signed_in_ok);
      log('info', data.logData, 'getToken OK response', response);
      return reply({token:data.token}).header('Authorization', data.token).code(response.result.statusCode);
    })
    .fail(function(err){
      response = Errors.createGeneralError(err);
      log('error', data.logData, 'getToken KO - Error: ', response);
      return reply(response).code(err.statusCode);
    });
};

exports.isAuthenticated = function (decoded, request, callback) {
  var data = {
    logData  : Utils.logData(request)
  };
  log('info', data.logData, 'isAuthenticated Accessing');
  var token = request.headers.authorization;
  jwt.verify(token, config.secretKey, function(err, decoded) {
    if (!err) {
      log('info', data.logData, 'isAuthenticated OK response');
      request.user = decoded;
      return callback(null, true);
    } else {
      log('error', data.logData, 'isAuthenticated KO response', err);
      return callback(null, false);
    }
  });
};
