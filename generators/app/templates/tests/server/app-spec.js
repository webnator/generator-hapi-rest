"use strict";

var rewire = require('rewire');

describe('Server app', function () {
  delete process.env.<%= appPrefix %>_NODE_ENV;
  var app           = rewire('../../server/app.js');
  var Hapi          = require('hapi');
  var server;

  beforeAll(function (done) {
    app.init().then(function () {
      server = app.__get__('server');
      done();
    });
  });

  afterAll(function (done) {
    process.env.<%= appPrefix %>_NODE_ENV = 'test';
    app.stopServer().then(function () {
      done();
    });
  });

  it('should have started correctly', function () {
    expect(server.info.started).not.toBe(0);
  });

  it('should be instance of Hapi', function () {
    expect(server).toEqual(jasmine.any(Hapi.Server));
  });

  it('should stop the server', function (done) {
    app.stopServer().then(function () {
      expect(server.info.started).toBe(0);
      done();
    });
  });
});

describe('Server Hapi mock', function () {
  var app = rewire('../../server/app.js');

  var serverMock, HapiMock, setAuthStrategyMock, GlobalModuleMock;

  describe('Success callbacks', function () {
    beforeEach(function (done) {

      setMocks();
      setSpies();

      app.__set__('Hapi', HapiMock);
      app.__set__('setAuthStrategy', setAuthStrategyMock);
      app.__set__('GlobalModule', GlobalModuleMock);

      app.init().then(function () {
        done();
      }, function () {
        done.fail('Init promise should be resolved');
      });
    });

    it('should have registered plugins', function () {
      expect(serverMock.register).toHaveBeenCalled();
    });

    it('should have called start', function () {
      expect(serverMock.start).toHaveBeenCalled();
    });

    it('should call server stop on stop', function (done) {

      app.__set__('GlobalModule', GlobalModuleMock);

      app.stopServer().then(function () {
        expect(serverMock.stop).toHaveBeenCalled();
        done();
      }, function(err) {
        done.fail('Promise should resolve' + err);
      });
    });
  });

  describe('Failing callbacks', function () {

    beforeEach(function () {

      setMocks();
      setSpies();

      app.__set__('Hapi', HapiMock);
      app.__set__('setAuthStrategy', setAuthStrategyMock);
      app.__set__('GlobalModule', GlobalModuleMock);
    });

    it('should fail on init with auth register failure', function (done) {
      setFailingAuthRegisterMock();

      app.init().then(function () {
        done.fail('Promise should NOT be resolved');
      }, function () {
        done();
      });
    });

    it('should fail on init with register failure', function (done) {
      setFailingRegisterMock();

      app.init().then(function () {
        done.fail('Promise should NOT be resolved');
      }, function () {
        done();
      });
    });

    it('should fail on init with start failure', function (done) {
      setFailingStartMock();

      app.init().then(function () {
        done.fail('Promise should NOT be resolved');
      }, function () {
        done();
      });
    });

    it('should fail on stop with stop failure', function (done) {
      setFailingStopMock();

      app.init().then(function () {
        app.stopServer().then(function (server) {
          done.fail('Promise should NOT be resolved');
        }, function () {
          done();
        });
      }, function (err) {
        done.fail('Init promise should be resolved');
      });
    });
  });

  function setSpies() {
    spyOn(serverMock, 'register').and.callThrough();
    spyOn(serverMock, 'start').and.callThrough();
    spyOn(serverMock, 'stop').and.callThrough();
  }

  function setMocks() {
    serverMock = {
      connection: function () {
      },
      register: function (var1, callback_1, callback_2) {
        var callback = callback_2;
        if (typeof callback_1 === 'function') {
          callback = callback_1;
        }
        return callback(undefined);
      },
      start: function (callback) {
        return callback(undefined);
      },
      stop: function (callback) {
        return callback(undefined);
      },
      plugins: {
        'hapi-mongodb': {
          db: 'test-db'
        }
      }
    };
    HapiMock = {
      Server: function () {
        return serverMock;
      }
    };
    setAuthStrategyMock = function () {
      return true;
    };
    GlobalModuleMock = {
      getConfigValue: function() {
        return {close: function(){}};
      },
      setConfigValue: function() {}
    };
  }

  function setFailingAuthRegisterMock() {
    serverMock.register = function (var1, callback_1, callback_2) {
      var callback = callback_2;
      if (typeof callback_1 === 'function') {
        callback = callback_1;
      }
      return callback('ERROR');
    }
  }

  function setFailingRegisterMock() {
    serverMock.register = function (var1, callback_1, callback_2) {
      var callback = callback_2;
      if (typeof callback_1 === 'function') {
        return callback(undefined);
      }
      return callback('ERROR');
    }
  }

  function setFailingStartMock() {
    serverMock.start = function (callback) {
      return callback('ERROR');
    }
  }

  function setFailingStopMock() {
    serverMock.stop = function (callback) {
      return callback('ERROR');
    }
  }

});
