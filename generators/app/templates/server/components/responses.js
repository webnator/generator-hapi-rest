'use strict';

module.exports = {
  //GENERAL
  general500: {
    code: 'GEN500',
    info: 'General error'
  },

  //<%= appName %>
  <%= cleanProjectName %>000: {
    code: '<%= appUppercaseName %>000',
    info: 'Operation successful'
  },

  <%= cleanProjectName %>200: {
    code: '<%= appUppercaseName %>200',
    info: 'Resource successfully created'
  },

  <%= cleanProjectName %>201: {
    code: '<%= appUppercaseName %>201',
    info: 'Resource successfully modified'
  },

  <%= cleanProjectName %>202: {
    code: '<%= appUppercaseName %>202',
    info: 'Resource successfully removed'
  },

  <%= cleanProjectName %>400: {
    code: '<%= appUppercaseName %>400',
    info: 'Bad request'
  },

  <%= cleanProjectName %>401: {
    code: '<%= appUppercaseName %>401',
    info: 'Authentication required'
  },

  <%= cleanProjectName %>403: {
    code: '<%= appUppercaseName %>403',
    info: 'Access forbidden'
  },

  <%= cleanProjectName %>404: {
    code: '<%= appUppercaseName %>404',
    info: 'Resource not found'
  },

  <%= cleanProjectName %>409: {
    code: '<%= appUppercaseName %>409',
    info: 'Conflict params'
  },

  <%= cleanProjectName %>500: {
    code: '<%= appUppercaseName %>500',
    info: 'General error'
  },

  <%= cleanProjectName %>501: {
    code: '<%= appUppercaseName %>501',
    info: 'Not implemented'
  }
};
