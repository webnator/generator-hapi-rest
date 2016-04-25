'use strict';

var responses = require('../../components/responses');

module.exports = {
  internal_ddbb_error: {
    statusCode: 500,
    code: responses.<%= cleanProjectName %>500.code,
    message: 'Internal DDBB Error'
  },

  user_signed_in_ok: {
    statusCode: 200,
    code: responses.<%= cleanProjectName %>200.code,
    message: 'User signed in successfully'
  },

  user_credentials_ko: {
    statusCode: 401,
    code: responses.<%= cleanProjectName %>401.code,
    message: 'User credentials are not correct'
  }
};
