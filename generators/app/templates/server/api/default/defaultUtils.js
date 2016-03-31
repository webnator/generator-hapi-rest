'use strict';

var defaultResponses  = require('./defaultResponses');
var GlobalModule      = require('../../components/global');
var mongo             = require('mongodb');
var Q                 = require('q');
var DefaultModel      = require('./models/defaultModel');
var Utils             = require('../../components/utils');
var log               = Utils.log;

exports.defaultAction = function(data){
  var deferred = Q.defer();

  if (true !== false) {
    log('info', data.logData, "defaultAction (Promise) OK");
    deferred.resolve(data);
  } else {
    log('error', data.logData, "defaultAction (Promise) KO");
    deferred.reject(defaultResponses.all_ko);
  }

  return deferred.promise;
};
