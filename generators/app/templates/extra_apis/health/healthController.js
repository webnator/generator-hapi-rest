'use strict';

var ResponsesHealth  = require('./healthResponses');
var Errors          = require('../../components/errors');
var config          = require('../../config/environment');
var mongo           = require('mongodb');
var Utils           = require('../../components/utils');
var w               = require('winston');
var log             = Utils.log;

var USERS_NAME_COLLECTION = 'users';

exports.healthCheck = function(request, reply, next) {
  var logData = Utils.logData(request);
  log('info', logData, 'healthCheck', request.payload);
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);

  colUser.findOne({}, {}, function(err, data){
    if (err) {
      log('error', logData, 'healthCheck DDBB KO');
      return reply({'status': 'KO'}).code(500);
    } else {
      log('info', logData, 'healthCheck DDBB OK');
      return reply({'status': 'OK'}).code(200);
    }
  });

}
