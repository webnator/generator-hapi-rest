'use strict';

var uuid          = require('uuid');
var GlobalModule  = require('./global');
var Q             = require('q');
var Joi           = require('joi');
var config        = require('../config/environment');
var w             = require('winston');
var crypto        = require('crypto');
const util        = require('util');
var req           = require('request');
w.level           = config.loggerLevel;

exports.getCollection = function(colName) {
  return GlobalModule.getConfigValue('db').collection(colName);
};

exports.generateUuid = function() {
  return uuid.v4();
};

exports.generateToken = function(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
};

exports.encryptText = function (encText) {
  var algorithm = 'aes-256-ctr';
  var text = String(encText);
  var cipher = crypto.createCipher(algorithm, config.salt);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decryptText = function (text) {
  var algorithm = 'aes-256-ctr';
  var decipher = crypto.createDecipher(algorithm, config.salt);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

exports.createResponseData = function(result, data) {
  var response = {
    result: result
  };
  if (data) {
    response.data = data;
  }
  return response;
};

exports.sendRequest = function (data){
  var deferred = Q.defer();
  exports.log('info', data.logData, 'Utils sending request', data.reqData);
  req(data.reqData, function(error, response, body){
    if(typeof body === 'string'){
      try{
        body = JSON.parse(body);
      } catch(e) {
        body = {};
      }
    }
    data.reqData.body = body;
    data.reqData.response = response;

    if (error) {
      exports.log('error', data.logData, 'Utils request failed', error);
      deferred.reject(error);
    } else {
      exports.log('info', data.logData, 'Utils request received', body);
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

exports.logData = function(request){
  return {
    method: request.method.toUpperCase(),
    uuid: this.generateUuid(),
    path: request.path
  };
};

exports.validateSchema = function(data){
  var deferred  = Q.defer();

  Joi.validate(data.payload, data.schema, function(err) {
    if (err) {
      var error = {
        message : err.details[0].message,
        code    : 400,
        statusCode    : 400
      };
      deferred.reject(error);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

exports.log = function(level, generalData, description, extraData){
  //TODO check all the possilble log occurences and levels
  var date = new Date().toISOString();
  var uudi = generalData.uuid || '';
  //TODO fix undefined issues
  // console.log(typeof generalData);
  if ((typeof generalData === 'string') || (typeof generalData !== 'object')){
    w[level](util.format( '%s [%s] %s | %s | "%s" %j', date, uudi, config.host, config.appName, generalData, description || {}));
  }else{
    var method = generalData.method.toUpperCase();// || "METHOD ERROR";
    var path = generalData.path; //|| "PATH ERROR";
    w[level](util.format( '%s [%s] %s | %s | %s %s | %s | extraData: %j', date, uudi, config.host, config.appName, method, path, description, extraData || {}));
  }
};
