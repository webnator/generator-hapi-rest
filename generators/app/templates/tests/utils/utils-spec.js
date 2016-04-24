var rewire = require("rewire");

describe('Utils functions', function () {

	var utils = rewire('../../server/components/utils.js');
  var GlobalModuleMock;
	beforeEach(function() {

    GlobalModuleMock = {
      getConfigValue: {}
    };
    utils.__set__('GlobalModule', GlobalModuleMock);

  });

	it('getCollection: should call GlobalModule with the right parameters', function () {
    var coll = jasmine.createSpy('coll');
    spyOn(GlobalModuleMock, 'getConfigValue').and.callFake(function () {
      return {
        collection: coll
      }
    });

    utils.getCollection('testCol');
    expect(GlobalModuleMock.getConfigValue).toHaveBeenCalledWith('db');
    expect(coll).toHaveBeenCalledWith('testCol');
  });

  it('generateUuid: should return a valid UUID', function () {
		expect(utils.generateUuid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });

  it('generateToken: should return a valid Token', function () {
		var token = utils.generateToken(12);
		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);
  });

  it('logData: should return a valid logData response', function () {
		var reqData = {
			method: 'TEST',
			path: 'TEST/PATH',
			testData: 'NOT SHOW'
		};
		var resultData = utils.logData(reqData);
		expect(typeof resultData).toBe('object');
		expect(resultData.method).toEqual(reqData.method);
		expect(resultData.path).toEqual(reqData.path);
		expect(resultData.testData).toBe(undefined);
		expect(resultData.uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });

  describe('createResponseData function', function () {
    it('createResponseData: should return a response data', function () {
      var resultData = utils.createResponseData('test', 'me');
      var expectedResult = {
        result: 'test',
        data: 'me'
      };
      expect(typeof resultData).toBe('object');
      expect(resultData).toEqual(expectedResult);
    });

    it('createResponseData: should return a response data without data', function () {
      var resultData = utils.createResponseData('test');
      var expectedResult = {
        result: 'test'
      };
      expect(typeof resultData).toBe('object');
      expect(resultData).toEqual(expectedResult);
      expect(resultData.data).toBe(undefined);
    });
  });

  describe('encryptText function', function () {
    it('encryptText: should return a hex string', function () {
      expect(utils.encryptText('hello')).toMatch(/[0-9A-Fa-f]{6}/g);
    });

    it('encryptText and then decryptText on a value should return the same value', function () {
      var textToEncrypt = 'testEncryption';
      var encripted = utils.encryptText(textToEncrypt);

      expect(utils.decryptText(encripted)).toBe(textToEncrypt);
    });
  });

  describe('validateSchema function', function () {
    it('validateSchema to call Joi.validate with the correct parameters', function () {
      var validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(undefined);
      });
      var joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi', joiSpy);

      var data = {
        payload: {},
        schema: {}
      };

      utils.validateSchema(data);

      expect(validateSpy).toHaveBeenCalledWith(data.payload, data.schema, jasmine.any(Function));
    });

    it('validateSchema to return an error if callback from Joi.validate is invalid', function (done) {
      var errorObject = {
        details: [
          {
            message: 'testError'
          }
        ]
      };
      var validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(errorObject);
      });
      var joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi', joiSpy);

      var data = {
        payload: {},
        schema: {}
      };
      utils.validateSchema(data)
        .then((response) => {
          done().fail('Promise should NOT be resolved');
        }).catch((err) => {
        done();
      });
    });

    it('validateSchema to return a valid response if Joi.validate is valid', function () {
      var validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(undefined);
      });
      var joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi', joiSpy);

      var data = {
        payload: {},
        schema: {}
      };
      utils.validateSchema(data)
        .then((response) => {
          done();
        }).catch((err) => {
        done().fail('Promise should be resolved');
      });
    });

  });

  describe('Send request function', function () {
    var data;

    beforeEach(function() {
      data = {
        reqData: {
          method: 'TEST',
          url: 'TEST'
        }
      };
    });

    it('should call the req library with the correct parameters', function () {
      var reqSpy = jasmine.createSpy('reqSpy');
      utils.__set__('req', reqSpy);
      spyOn(utils, 'log');
      utils.sendRequest(data);

      expect(reqSpy).toHaveBeenCalled();
      expect(1).toBe(1);
      expect(reqSpy.calls.argsFor(0)[0]).toEqual(data.reqData);
    });

    describe('async passing tests getting a string', function () {
      var body;
      beforeEach(function(done) {
        var reqSpy = jasmine.createSpy('reqSpy').and.callFake(function (data, callback) {
          callback(undefined, {}, '{ "myObject": "test" }');
        });
        utils.__set__('req', reqSpy);
        spyOn(utils, 'log');
        utils.sendRequest(data)
          .then((response) => {
            body = response.reqData.body;
            done();
          })
          .catch((err) => {
            done.fail('Promise should be resolved');
          });
      });

      it('should parse the body to an object if it is a string', function () {
        expect(body).toEqual(jasmine.any(Object));
      });

      it('should have called the log function twice', function () {
        expect(utils.log.calls.count()).toBe(2);
      });
    });

    describe('async passing tests getting an object', function () {
      var body;
      beforeEach(function(done) {
        var reqSpy = jasmine.createSpy('reqSpy').and.callFake(function (data, callback) {
          callback(undefined, {}, { myObject: 'test' });
        });
        utils.__set__('req', reqSpy);
        spyOn(utils, 'log');
        utils.sendRequest(data)
          .then((response) => {
            body = response.reqData.body;
            done();
          })
          .catch((err) => {
            done.fail('Promise should be resolved');
          });
      });

      it('should return the body as is', function () {
        expect(body).toEqual(jasmine.any(Object));
      });
    });

    describe('async failing tests', function () {
      var err;
      beforeEach(function(done) {
        var reqSpy = jasmine.createSpy('reqSpy').and.callFake(function (data, callback) {
          callback(true, {}, '{ "myObject": "test" }');
        });
        utils.__set__('req', reqSpy);
        spyOn(utils, 'log');
        utils.sendRequest(data)
          .then((response) => {
            done.fail('Promise should NOT be resolved');
          })
          .catch((error) => {
            err = error;
            done();
          });
      });
      it('should have called the log function twice', function () {
        expect(utils.log.calls.count()).toBe(2);
      });
      it('should return an error', function () {
        expect(err).toBeTruthy();
      });
    });

    describe('wrong response tests', function () {
      var body;

      beforeEach(function(done) {
        var reqSpy = jasmine.createSpy('reqSpy').and.callFake(function (data, callback) {
          callback(undefined, {}, 'BadResponseString');
        });
        utils.__set__('req', reqSpy);
        spyOn(utils, 'log');
        utils.sendRequest(data)
          .then((response) => {
            body = response.reqData.body;
            done();
          })
          .catch((err) => {
            done.fail('Promise should be resolved');
          });
      });

      it('should return an empty body object', function() {
        expect(body).toEqual({});
      });
    });

  });

  describe('log function', function () {
    // TODO Test this function properly
    var wMock, wSpy;
    beforeEach(function () {
      wSpy = jasmine.createSpy('wSpy');
      wMock = {
        test: wSpy
      };
      utils.__set__('w', wMock);
    });

    it('shoul call w', function () {
      utils.log('test', '', 'test call', {});
      expect(wSpy).toHaveBeenCalled();
    });

    it('shoul call w when data is number', function () {
      utils.log('test', 123, 'test call', {});
      expect(wSpy).toHaveBeenCalled();
    });

    it('shoul call w when data is number without description', function () {
      utils.log('test', 123);
      expect(wSpy).toHaveBeenCalled();
    });

    it('shoul call w when general data is an object with uuid', function () {
      var data = {
        method: 'test',
        path: 'testPath',
        uuid: 'test-123'
      };
      utils.log('test', data, 'test call', {});
      expect(wSpy).toHaveBeenCalled();
    });

    it('shoul call w when general data is an object without uuid', function () {
      var data = {
        method: 'test',
        path: 'testPath'
      };
      utils.log('test', data, 'test call', {});
      expect(wSpy).toHaveBeenCalled();
    });

    it('shoul call w when general data is an object without description', function () {
      var data = {
        method: 'test',
        path: 'testPath'
      };
      utils.log('test', data);
      expect(wSpy).toHaveBeenCalled();
    });

  });

});
