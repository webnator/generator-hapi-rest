'use strict';

var <%= moduleName %>Responses  = require('./../responses/<%= moduleName %>Responses');
var Q                 = require('q');
var Utils             = require('../../../components/utils');
var log               = Utils.log;

var resolve = true;

exports.defaultAction = function(data){
  var deferred = Q.defer();
  if (resolve !== false) {
    log('info', data.logData, '<%= moduleName %>Action (Promise) OK');
    deferred.resolve(data);
  } else {
    log('error', data.logData, '<%= moduleName %>Action (Promise) KO');
    deferred.reject(<%= moduleName %>Responses.all_ko);
  }

  return deferred.promise;
};
