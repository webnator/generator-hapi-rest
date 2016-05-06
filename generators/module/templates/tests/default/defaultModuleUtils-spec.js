"use strict";

var rewire = require("rewire");
var Q     = require('q');

describe('<%= moduleName %>Utils functions', function () {
  var <%= moduleName %>Utils = rewire('../../server/api/<%= moduleName %>/controllers/<%= moduleName %>Utils.js');

  var UtilsMock;

  beforeEach(function () {
    UtilsMock = {
      log: jasmine.createSpy('utilsSpy')
    };
    <%= moduleName %>Utils.__set__('Utils', UtilsMock);
    <%= moduleName %>Utils.__set__('log', UtilsMock.log);
  });

  describe('defaultAction', function () {

    it('should resolve by default', function (done) {
      <%= moduleName %>Utils.defaultAction({}).then(function () {
        expect(UtilsMock.log).toHaveBeenCalled();
        done();
      }, function (err) {
        console.log('Failed with error', err);
        done.fail('Promise should resolve');
      });
    });

    it('should reject if resolve is false', function (done) {
      <%= moduleName %>Utils.__set__('resolve', false);
      <%= moduleName %>Utils.defaultAction({}).then(function () {
        done.fail('Promise shouldn\'t resolve');
      }, function () {
        expect(UtilsMock.log).toHaveBeenCalled();
        done();
      });
    });

  });
});
