var rewire = require("rewire");

describe('<%= moduleName %> check', function () {

	var <%= moduleName %> = rewire('../../server/api/<%= moduleName %>/<%= moduleName %>Controller.js');

	it('should be true', function () {
    expect(1).toBe(1);
	});
});
