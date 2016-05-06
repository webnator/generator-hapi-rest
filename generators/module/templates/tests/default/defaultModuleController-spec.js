'use strict';

var rewire = require('rewire');

describe('<%= moduleName %>Controller functions', function () {
	var <%= moduleName %>Controller  = rewire('../../server/api/<%= moduleName %>/controllers/<%= moduleName %>Controller.js');
	var Q     = require('q');

	var UtilsMock, <%= moduleName %>Utils, validateSchemaMock, <%= moduleName %>ResponsesMock, ErrorsMock;
	var req, rep, next;

	beforeEach(function () {
		validateSchemaMock = jasmine.createSpy('validateSchema').and.callFake(function () {
			var deferred  = Q.defer();
      deferred.resolve(true);
			return deferred.promise;
		});

		UtilsMock = {
			logData: function () {},
			log: jasmine.createSpy('logSpy'),
			validateSchema: validateSchemaMock,
			createResponseData: jasmine.createSpy('createResponseDataMock').and.callFake(function (msg) {
				return {
          result: {
            message: msg,
            statusCode: 200
          }
        }
      })
		};

		<%= moduleName %>Utils = {
			defaultAction: jasmine.createSpy('defaultActionMock').and.callFake(function(){
				var deferred  = Q.defer();
				deferred.resolve(true);
				return deferred.promise;
			})
		};

		<%= moduleName %>ResponsesMock = {
			all_ok: 'TEST-OK'
		};

		ErrorsMock = {
			createGeneralError: jasmine.createSpy('createGeneralErrorMock').and.callFake(function(err){
        return {
          error: err,
          statusCode: 500
        };
			})
		};

		<%= moduleName %>Controller.__set__('Utils', UtilsMock);
		<%= moduleName %>Controller.__set__('log', UtilsMock.log);
		<%= moduleName %>Controller.__set__('_<%= moduleName %>Utils', <%= moduleName %>Utils);
		<%= moduleName %>Controller.__set__('<%= moduleName %>Responses', <%= moduleName %>ResponsesMock);
		<%= moduleName %>Controller.__set__('Errors', ErrorsMock);

		req = {};
		rep = {};
		next = function (res) {};
	});

	it('should call the required functions', function (done) {

		var doneFunction = done;
		var rep = jasmine.createSpy('replyMock').and.callFake(function() {
      return {
				code: function () {
          expect(UtilsMock.validateSchema).toHaveBeenCalled();
					expect(<%= moduleName %>Utils.defaultAction).toHaveBeenCalled();

					expect(UtilsMock.createResponseData).toHaveBeenCalledWith(<%= moduleName %>ResponsesMock.all_ok);
          var expectedRes = UtilsMock.createResponseData(<%= moduleName %>ResponsesMock.all_ok);
					expect(rep).toHaveBeenCalledWith(expectedRes);

					expect(UtilsMock.log).toHaveBeenCalled();

					doneFunction();
				}
			}
		});

		<%= moduleName %>Controller.getDefaultModule(req, rep, next);
	});

	it('should return an error in case of a failed promise', function (done) {
		var returnMsg = 'TEST-KO';
		<%= moduleName %>Utils.defaultAction = jasmine.createSpy('defaultActionMock').and.callFake(function(){
			var deferred  = Q.defer();
			deferred.reject(returnMsg);
			return deferred.promise;
		});

		var doneFunction = done;
		var rep = jasmine.createSpy('replyMock').and.callFake(function() {
			return {
				code: function () {
					expect(UtilsMock.validateSchema).toHaveBeenCalled();
					expect(<%= moduleName %>Utils.defaultAction).toHaveBeenCalled();

					expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith(returnMsg);
					expect(rep).toHaveBeenCalledWith(ErrorsMock.createGeneralError(returnMsg));

					expect(UtilsMock.log).toHaveBeenCalled();

					doneFunction();
				}
			}
		});

		<%= moduleName %>Controller.getDefaultModule(req, rep, next);
	});

	it('should return an error in case of a failed promise and not call next function', function (done) {
		var returnMsg = 'TEST-KO';
    UtilsMock.validateSchema = jasmine.createSpy('validateSchema').and.callFake(function () {
      var deferred  = Q.defer();
      deferred.reject(returnMsg);
      return deferred.promise;
    });

    var doneFunction = done;
		var rep = jasmine.createSpy('replyMock').and.callFake(function() {
			return {
				code: function () {
          expect(UtilsMock.validateSchema).toHaveBeenCalled();
					expect(<%= moduleName %>Utils.defaultAction).not.toHaveBeenCalled();

					expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith(returnMsg);

					expect(rep).toHaveBeenCalledWith(ErrorsMock.createGeneralError(returnMsg));

					expect(UtilsMock.log).toHaveBeenCalled();

					doneFunction();
				}
			}
		});

		<%= moduleName %>Controller.getDefaultModule(req, rep, next);
	});
});
