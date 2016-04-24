'use strict';

var defaultResponses = require('./defaultResponses');

var Errors        = require('../../components/errors');
var Utils         = require('../../components/utils');
var DefaultModelJoi  = require('./models/defaultModelJoi');
var _userUtils    = require('./defaultUtils');
var log           = Utils.log;

exports.getDefault = function(request, reply) {
  var data = {
    logData : Utils.logData(request),
    payload : request.query,
    schema  : new DefaultModelJoi()
  };
  var response;
  log('info', data.logData, 'getDefault Accessing');

  Utils.validateSchema(data)
    .then(_userUtils.defaultAction)
    .then(function(){
      response = Utils.createResponseData(defaultResponses.all_ok);
      log('info', data.logData, 'getDefault OK response', response);
      return reply(response).code(response.result.statusCode);
    })
    .fail(function(err){
      response = Errors.createGeneralError(err);
      log('error', data.logData, 'getDefault KO - Error: ', response);
      return reply(response).code(err.statusCode);
    });
};
