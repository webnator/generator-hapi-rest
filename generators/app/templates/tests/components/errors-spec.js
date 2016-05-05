"use strict";

describe('Errors functions', function () {

  var errors = require('../../server/components/errors.js');
  var Responses = require('../../server/components/responses');

  it('should return a general error', function () {
    var err = {
      statusCode: '000',
      code: 'TESTCODE',
      message: 'TESTERROR'
    };

    var generatedError = errors.createGeneralError(err);
    expect(generatedError.result).toEqual(err);
  });

  it('should return a generic code error', function () {
    var err = {
      statusCode: '000',
      message: 'TESTERROR'
    };

    var generatedError = errors.createGeneralError(err);
    expect(generatedError.result.statusCode).toEqual(err.statusCode);
    expect(generatedError.result.message).toEqual(err.message);
    expect(generatedError.result.code).toEqual(Responses.general500.code);
  });


});