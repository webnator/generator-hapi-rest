'use strict';
var Joi       = require('joi');

function authModelJoi() {
  var schema = Joi.object().keys({
    email     : Joi.string().email().trim().required(),
    password  : Joi.string().trim().required()
  });
  return schema;
}

module.exports = authModelJoi;
