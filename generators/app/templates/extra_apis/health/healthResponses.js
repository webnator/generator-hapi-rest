'use strict';

var responses = require('../../components/responses');

module.exports = {
  internal_ddbb_error: {
    statusCode: 500,
    code: responses.general500.code,
    message: 'Internal ddbb error'
  }
};
