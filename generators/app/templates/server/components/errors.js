'use strict';

var Responses = require('./responses');

exports.createGeneralError = function (err) {
  var error = {
    result: {
      statusCode: err.statusCode,
      code      : err.code || Responses.general500.code,
      message   : err.message
    }
  };
  return error;
};
