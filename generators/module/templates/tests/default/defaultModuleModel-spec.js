"use strict";

var rewire = require("rewire");

describe('defaultModuleModel functions', function () {
  var defaultModuleModel = rewire('../../server/api/defaultModule/models/defaultModuleModel.js');

  beforeAll(function () {
    spyOn(defaultModuleModel.__get__('crypto'), 'createHash').and.callThrough();
  });

  it('should return a valid model', function () {
    var defaultModule = new defaultModuleModel({});

    expect(defaultModuleModel.__get__('crypto').createHash).toHaveBeenCalled();
    expect(defaultModule.dateCreated).toEqual(jasmine.any(Date));

  });

});