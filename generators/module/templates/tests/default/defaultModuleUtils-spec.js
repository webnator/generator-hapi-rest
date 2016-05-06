"use strict";

var rewire = require("rewire");
var Q     = require('q');

describe('defaultModuleUtils functions', function () {
  var defaultModuleUtils = rewire('../../server/api/defaultModule/controllers/defaultModuleUtils.js');

  var UtilsMock;

  beforeEach(function () {
    UtilsMock = {
      log: jasmine.createSpy('utilsSpy')
    };
    defaultModuleUtils.__set__('Utils', UtilsMock);
    defaultModuleUtils.__set__('log', UtilsMock.log);
  });

  describe('defaultAction', function () {

    it('should resolve by default', function (done) {
      defaultModuleUtils.defaultAction({}).then(function () {
        expect(UtilsMock.log).toHaveBeenCalled();
        done();
      }, function (err) {
        console.log('Failed with error', err);
        done.fail('Promise should resolve');
      });
    });

    it('should reject if resolve is false', function (done) {
      defaultModuleUtils.__set__('resolve', false);
      defaultModuleUtils.defaultAction({}).then(function () {
        done.fail('Promise shouldn\'t resolve');
      }, function () {
        expect(UtilsMock.log).toHaveBeenCalled();
        done();
      });
    });

  });
});