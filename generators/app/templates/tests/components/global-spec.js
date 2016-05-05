"use strict";

var rewire = require("rewire");

describe('Global functions', function () {

  var global = rewire('../../server/components/global.js');

  it('should return undefined if the config is not set', function () {
    expect(global.getConfigValue('TEST')).not.toBeDefined();
  });

  it('should return the param value', function () {
    var val = '123';
    global.__set__('config', { test: val});
    expect(global.getConfigValue('test')).toBe(val);
  });

  it('should set the param value', function () {
    var val = '456';
    global.__set__('config', { test: val});
    global.setConfigValue('test', val);
    var config = global.__get__('config');
    expect(config.test).toBe(val);
  });

  it('should set the param value and retrieve the same', function () {
    var val = '789';
    global.setConfigValue('test', val);
    expect(global.getConfigValue('test')).toBe(val);
  });

  it('should get the entire config object', function () {
    var config = {
      param1: 'test-1',
      param2: 'test-2',
      param3: 'test-3',
      param4: 'test-4'
    };
    global.__set__('config', config);
    expect(global.getConfigList()).toBe(config);
  });

});