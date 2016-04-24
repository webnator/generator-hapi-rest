var rewire = require("rewire");

describe('Health check', function () {

	var health = rewire('../../server/api/health/healthController.js');
	var req, rep, next;
	var UtilsMock, logSpy;

	beforeEach(function() {

    req = {};
		rep = {};
		next = function (res) {};

		UtilsMock = {
    	getCollection: function (col) {
				var vm = {};
				vm.findOne = function (obj1, obj2, callback) {
					callback(undefined, {});
				};
      	return vm;
    	},
			logData: function() {
				return {
			    method: 'TEST',
			    uuid: '123-TEST',
			    path: 'TEST/PATH'
			  };
			},
			log: function (var1, var2, var3, var4) {
        console.log(var1, var2, var3, var4);
        return true;
      }
		};
    health.__set__('Utils', UtilsMock);
    logSpy = jasmine.createSpy('logSpy');
    health.__set__('log', logSpy);
  });

  it('should return health OK', function () {
		var code = jasmine.createSpy('code');
		var rep = jasmine.createSpy('rep').and.callFake(function () {
			return {
				code: code
			};
		});
    health.healthCheck(req, rep, next);

		expect(rep).toHaveBeenCalledWith({'status': 'OK'});
		expect(code).toHaveBeenCalledWith(200);
    expect(logSpy.calls.count()).toBe(2);
	});

	it('should return health KO', function () {
		UtilsMock.getCollection = function (col) {
			var vm = {};
			vm.findOne = function (obj1, obj2, callback) {
				callback(true, {});
			};
			return vm;
		};
		health.__set__('Utils', UtilsMock);

		var code = jasmine.createSpy('code');
		var rep = jasmine.createSpy('rep').and.callFake(function () {
			return {
				code: code
			};
		});
    health.healthCheck(req, rep, next);

		expect(rep).toHaveBeenCalledWith({'status': 'KO'});
		expect(code).toHaveBeenCalledWith(500);
    expect(logSpy.calls.count()).toBe(2);
	});

});
