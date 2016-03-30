'use strict';

var responses = require('../../components/responses');

module.exports = {
  internal_ddbb_error: {
    statusCode: 500,
    code: responses.aggregator500.code,
    message: 'Internal DDBB Error'
  },

  user_signed_up_ok: {
    statusCode: 200,
    code: responses.aggregator200.code,
    message: 'User signed up successfully'
  },

  user_email_already_exists: {
    statusCode: 409,
    code: responses.aggregator409.code,
    message: 'The user has been already registered'
  },

  user_does_not_exists: {
    statusCode: 404,
    code: responses.aggregator404.code,
    message: 'That user does not exists'
  },

  user_info_retrieved_ok: {
    statusCode: 200,
    code: responses.aggregator404.code,
    message: 'User info retrieved successfully'
  },

  user_app_invalid: {
    statusCode: 403,
    code: responses.aggregator403.code,
    message: 'The application is not registered, or has fulfilled its quota'
  }
};
