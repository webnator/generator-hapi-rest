'use strict';
var Joi       = require('joi');

function <%= moduleName %>ModelJoi() {
  var schema = Joi.object().keys({
    email       : Joi.string().email().trim(),
    password    : Joi.string().min(6).max(20).trim()
  });
  return schema;
}

module.exports = <%= moduleName %>ModelJoi;
