'use strict';

var Utils           = require('../../components/utils');
var log             = Utils.log;

var USERS_NAME_COLLECTION = 'users';

exports.healthCheck = function(request, reply) {
  var logData = Utils.logData(request);
  log('info', logData, 'healthCheck', request.payload);
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);

  colUser.findOne({}, {}, function(err){
    if (err) {
      log('error', logData, 'healthCheck DDBB KO');
      return reply({'status': 'KO'}).code(500);
    } else {
      log('info', logData, 'healthCheck DDBB OK');
      return reply({'status': 'OK'}).code(200);
    }
  });
};
