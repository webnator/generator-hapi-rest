var rewire = require("rewire");

describe('Utils functions', function () {

	var utils = rewire('../../server/components/utils.js');

	beforeEach(function() {

  });

  it('should return a valid UUID', function () {
		expect(utils.generateUuid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
	});

	it('should return a valid Token', function () {
		var token = utils.generateToken(12);
		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);
	});

	it('should return a response data', function () {
		var resultData = utils.createResponseData('test', 'me');
		var expectedResult = {
			result: 'test',
			data: 'me'
		}
		expect(typeof resultData).toBe('object');
		expect(resultData).toEqual(expectedResult);
	});

	it('should return a response data without data', function () {
		var resultData = utils.createResponseData('test');
		var expectedResult = {
			result: 'test'
		}
		expect(typeof resultData).toBe('object');
		expect(resultData).toEqual(expectedResult);
		expect(resultData.data).toBe(undefined);
	});

	it('should return a logData', function () {
		var reqData = {
			method: 'TEST',
			path: 'TEST/PATH',
			testData: 'NOT SHOW'
		}
		var resultData = utils.logData(reqData);
		expect(typeof resultData).toBe('object');
		expect(resultData.method).toEqual(reqData.method);
		expect(resultData.path).toEqual(reqData.path);
		expect(resultData.testData).toBe(undefined);
		expect(resultData.uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
	});



});
