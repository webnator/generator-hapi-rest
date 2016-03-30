'use strict';

module.exports = {
  //GENERAL
  general500: {
    code: 'GEN500',
    info: 'General error'
  },

  //<%= appName %>
  <%= appName %>000: {
    code: '<%= appUppercaseName %>000',
    info: 'Operation successful'
  },

  <%= appName %>200: {
    code: '<%= appUppercaseName %>200',
    info: 'Resource successfully created'
  },

  <%= appName %>201: {
    code: '<%= appUppercaseName %>201',
    info: 'Resource successfully modified'
  },

  <%= appName %>202: {
    code: '<%= appUppercaseName %>202',
    info: 'Resource successfully removed'
  },

  <%= appName %>400: {
    code: '<%= appUppercaseName %>400',
    info: 'Bad request'
  },

  <%= appName %>401: {
    code: '<%= appUppercaseName %>401',
    info: 'Authentication required'
  },

  <%= appName %>403: {
    code: '<%= appUppercaseName %>403',
    info: 'Access forbidden'
  },

  <%= appName %>404: {
    code: '<%= appUppercaseName %>404',
    info: 'Resource not found'
  },

  <%= appName %>409: {
    code: '<%= appUppercaseName %>409',
    info: 'Conflict params'
  },

  <%= appName %>500: {
    code: '<%= appUppercaseName %>500',
    info: 'General error'
  },

  <%= appName %>501: {
    code: '<%= appUppercaseName %>501',
    info: 'Not implemented'
  }
};
