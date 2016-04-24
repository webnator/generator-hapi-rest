'use strict';

var responses = require('../../components/responses');

module.exports = {
  internal_ddbb_error: {
    statusCode: 500,
    code: responses.<%= appName %>500.code,
    message: 'Internal DDBB Error'
  },

  all_ok: {
    statusCode: 200,
    code: responses.<%= appName %>200.code,
    message: 'Yay! all good'
  },

  all_ko: {
    statusCode: 400,
    code: responses.<%= appName %>400.code,
    message: 'Nay! all bad'
  }
};
