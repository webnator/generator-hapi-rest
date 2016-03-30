'use strict';
var Joi       = require('joi');

function userModelJoi() {
  var schema = Joi.object().keys({
    email       : Joi.string().email().trim().required(),
    password    : Joi.string().min(6).max(20).trim().required(),
    application : Joi.string().required()
  });
  return schema;
}

module.exports = userModelJoi;
