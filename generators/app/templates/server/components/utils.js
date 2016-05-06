'use strict';

var uuid          = require('uuid');
var GlobalModule  = require('./global');
var Q             = require('q');
var Joi           = require('joi');
var config        = require('../config/environment');
var crypto        = require('crypto');
const util        = require('util');
var req           = require('request');
var winston       = require('winston');

var w = new (winston.Logger)({
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  }
});

w.add(winston.transports.Console, {
  level: config.loggerLevel,
  prettyPrint: true,
  colorize: true,
  silent: false
  // , timestamp: false
});

exports.getCollection       = getCollection;
exports.generateUuid        = generateUuid;
exports.generateToken       = generateToken;
exports.encryptText         = encryptText;
exports.decryptText         = decryptText;
exports.createResponseData  = createResponseData;
exports.sendRequest         = sendRequest;
exports.logData             = logData;
exports.validateSchema      = validateSchema;
exports.log                 = log;

function getCollection(colName) {
  return GlobalModule.getConfigValue('db').collection(colName);
}

function generateUuid() {
  return uuid.v4();
}

function generateToken(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
}

function encryptText(encText) {
  var algorithm = 'aes-256-ctr';
  var text = String(encText);
  var cipher = crypto.createCipher(algorithm, config.salt);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decryptText(text) {
  var algorithm = 'aes-256-ctr';
  var decipher = crypto.createDecipher(algorithm, config.salt);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

function createResponseData(result, data) {
  var response = {
    result: result
  };
  if (data) {
    response.data = data;
  }
  return response;
}

function sendRequest(data){
  var deferred = Q.defer();
  log('info', data.logData, 'Utils sending request', data.reqData);
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
      log('error', data.logData, 'Utils request failed', error);
      deferred.reject(error);
    } else {
      log('info', data.logData, 'Utils request received', body);
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}

function logData(request){
  return {
    method: request.method.toUpperCase(),
    uuid: generateUuid(),
    path: request.path
  };
}

function validateSchema(data){
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
}

function log(level, generalData, description, extraData){
  //TODO check all the possilble log occurences and levels
  extraData = config.logExtradata ? extraData : undefined;
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
}
