'use strict';

var userResponses   = require('./userResponses');
var GlobalModule    = require('../../components/global');
var mongo           = require('mongodb');
var Q               = require('q');
var UserModel       = require('./models/userModel');
var Utils           = require('../../components/utils');
var log             = Utils.log;

var USERS_NAME_COLLECTION = 'users';
var APPS_NAME_COLLECTION = 'applications';

exports.userExistsKo = function(data){
  var deferred = Q.defer();
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var query = {
    email: data.payload.email,
    application: data.payload.application
  };

  colUser.findOne(query, function(err, user){
    if(err){
      log('error', data.logData, "userExistsKo (Promise) KO");
      deferred.reject(userResponses.internal_ddbb_error);
    } else {
      if (user) {
        log('error', data.logData, "userExistsKo (Promise) KO");
        deferred.reject(userResponses.user_email_already_exists)
      } else {
        log('info', data.logData, "userExistsKo (Promise) OK");
        deferred.resolve(data);
      }
    }
  });

  return deferred.promise;
};

exports.appAuthorized = function(data){
  var deferred = Q.defer();

  appExists(data)
    .then(appHasntReachedMax)
    .then(function (response) {
      deferred.resolve(response);
    })
    .fail(function (err) {
      deferred.reject(err);
    })

  return deferred.promise;
};

exports.userInsert = function(data){
  var deferred = Q.defer();
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var newUser = new UserModel(data.payload);

  colUser.save(newUser, function(err){
    if(err){
      log('error', data.logData, "userInsert (Promise) KO");
      deferred.reject(userResponses.internal_ddbb_error);
    } else {
      log('info', data.logData, "userInsert (Promise) OK");
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

exports.userUpdate = function (data) {
  var deferred = Q.defer();
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var user = {
    uuid: data.user.uuid
  };
  var update = {
    '$set': data.user
  }
  colUser.update(user, update, function(err){
    if(err){
      log('error', data.logData, "userUpdate (Promise) KO");
      deferred.reject(userResponses.internal_ddbb_error);
    } else {
      log('info', data.logData, "userUpdate (Promise) OK");
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}

exports.userInfo = function(data){
  var deferred = Q.defer();
  var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
  var query = {
    uuid: data.user.uuid
  };
  var projection = {_id: 0, password: 0};

  colUser.findOne(query, projection, function(err, user){
    if(err){
      log('error', data.logData, "userInfo (Promise) KO");
      deferred.reject(userResponses.internal_ddbb_error);
    } else {
      if (!user) {
        log('error', data.logData, "userInfo (Promise) KO");
        deferred.reject(userResponses.user_does_not_exists)
      } else {
        data.user = user;
        log('info', data.logData, "userInfo (Promise) OK");
        deferred.resolve(data);
      }
    }
  });

  return deferred.promise;
}

function appExists(data) {
  var deferred = Q.defer();

  var colApp = Utils.getCollection(APPS_NAME_COLLECTION);
  var query = {
    code: data.payload.application
  };

  colApp.findOne(query, function(err, app){
    if(err){
      log('error', data.logData, "appAuthorized (Promise) KO");
      deferred.reject(userResponses.internal_ddbb_error);
    } else {
      if (!app) {
        log('error', data.logData, "appAuthorized (Promise) KO");
        deferred.reject(userResponses.user_app_invalid)
      } else {
        log('info', data.logData, "appAuthorized (Promise) OK");
        data.application = app;
        deferred.resolve(data);
      }
    }
  });

  return deferred.promise;
}


function appHasntReachedMax(data) {
  var deferred = Q.defer();
  var maxUsers = data.application.maxUsers;
  if (maxUsers === 0) {
    deferred.resolve(data);
  } else {

    var colUser = Utils.getCollection(USERS_NAME_COLLECTION);
    var query = {
      application: data.application.code
    };

    colUser.find(query).count(function(err, totalUsers){
      if(err){
        log('error', data.logData, "appHasntReachedMax (Promise) KO");
        deferred.reject(userResponses.internal_ddbb_error);
      } else {
        if (totalUsers >= maxUsers) {
          log('error', data.logData, "appHasntReachedMax (Promise) KO");
          deferred.reject(userResponses.user_app_invalid)
        } else {
          log('info', data.logData, "appHasntReachedMax (Promise) OK");
          deferred.resolve(data);
        }
      }
    });
  }
  return deferred.promise;
}
