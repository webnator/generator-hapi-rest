'use strict';

var DefaultResponses = require('./defaultResponses');

var Errors        = require('../../components/errors');
var Utils         = require('../../components/utils');
var DefaultModelJoi  = require('./models/defaultModelJoi');
var _userUtils    = require('./defaultUtils');
var log           = Utils.log;

exports.getDefault = function(request, reply, next) {
  var data = {
    logData : Utils.logData(request),
    query   : request.query,
    schema  : new DefaultModelJoi()
  };
  var response;
  log('info', data.logData, 'getDefault Accessing');

  Utils.validateSchema(data)
    .then(_userUtils.userExistsKo)
    .then(_userUtils.appAuthorized)
    .then(_userUtils.userInsert)
    .then(function(){
      response = Utils.createResponseData(DefaultResponses.user_signed_up_ok);
      log('info', data.logData, 'userCreate OK response', response);
      return reply(response).code(response.result.statusCode);
    })
    .fail(function(err){
      response = Errors.createGeneralError(err);
      log('error', data.logData, 'userCreate KO - Error: ', response);
      return reply(response).code(err.statusCode);
    });
};
