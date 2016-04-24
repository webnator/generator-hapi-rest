'use strict';

var <%= moduleName %>Responses = require('./<%= moduleName %>Responses');

var Errors        = require('../../components/errors');
var Utils         = require('../../components/utils');
var <%= moduleNamePascal %>ModelJoi  = require('./models/<%= moduleName %>ModelJoi');
var _<%= moduleName %>Utils    = require('./<%= moduleName %>Utils');
var log           = Utils.log;

exports.get<%= moduleNamePascal %> = function(request, reply) {
  var data = {
    logData : Utils.logData(request),
    payload : request.query,
    schema  : new <%= moduleNamePascal %>ModelJoi()
  };
  var response;
  log('info', data.logData, 'get<%= moduleNamePascal %> Accessing');

  Utils.validateSchema(data)
    .then(_<%= moduleName %>Utils.defaultAction)
    .then(function(){
      response = Utils.createResponseData(<%= moduleName %>Responses.all_ok);
      log('info', data.logData, 'get<%= moduleNamePascal %> OK response', response);
      return reply(response).code(response.result.statusCode);
    })
    .fail(function(err){
      response = Errors.createGeneralError(err);
      log('error', data.logData, 'get<%= moduleNamePascal %> KO - Error: ', response);
      return reply(response).code(err.statusCode);
    });
};
