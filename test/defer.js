var chai = require("chai");
	chai.should();

describe("Deferred execution",function() {

	it("should be runnable without error",function(done) {
		
		var promise = require(__dirname + "/../yoyaku.js");
		
		function exampleFunction(callbackIn) {
			callbackIn();
		}
		
		function exampleCallback() {
			done();
		}
		
		var example = promise.yepnope(exampleCallback);
		
		example.defer.should.be.a("function");
		example.defer().should.be.a("function");
		example.defer().yep.should.be.a("function");
		example.defer().nope.should.be.a("function");
		
		exampleFunction(example.defer());
		
	});
	
	it("should pass arguments through transparently",function(done) {
		
		var promise = require(__dirname + "/../yoyaku.js");
		
		function exampleFunction(callbackIn) {
			callbackIn();
		}
		
		function exampleCallback(arg1,arg2,arg3,callback) {
			arg1.should.equal(1);
			arg2.should.equal(2);
			arg3.should.equal(3);
			
			done();
		}
		
		// Doesn't have to be yepnope - could be something else.
		var example = promise.yepnope(exampleCallback);
		
		exampleFunction(example.defer(1,2,3));
		
	});
	
	it("should maintain availability of promise callbacks",function(done) {
		
		var promise = require(__dirname + "/../yoyaku.js");
		
		function exampleFunction(callbackIn) {
			callbackIn();
		}
		
		function exampleCallback(arg1,arg2,arg3,callback) {
			process.nextTick(function() {
				callback(null);
			});
		}
		
		// Doesn't have to be yepnope - could be something else.
		var example = promise.yepnope(exampleCallback);
		
		exampleFunction(
			example.defer(1,2,3)
				.yep(done));
		
	});
	
});