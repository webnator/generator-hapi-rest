'use strict';

var rewire = require('rewire');

describe('<%= moduleName %>Model functions', function () {
  var <%= moduleName %>Model = rewire('../../server/api/<%= moduleName %>/models/<%= moduleName %>Model.js');

  beforeAll(function () {
    spyOn(<%= moduleName %>Model.__get__('crypto'), 'createHash').and.callThrough();
  });

  it('should return a valid model', function () {
    var <%= moduleName %> = new <%= moduleName %>Model({});

    expect(<%= moduleName %>Model.__get__('crypto').createHash).toHaveBeenCalled();
    expect(<%= moduleName %>.dateCreated).toEqual(jasmine.any(Date));

  });

});
