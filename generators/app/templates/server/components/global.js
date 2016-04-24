'use strict';

var config = {};

exports.getConfigValue = function(param) {
  return config[param];
};

exports.setConfigValue = function(param, value) {
  config[param] = value;
  return config[param];
};

exports.getConfigList = function() {
  return config;
};
