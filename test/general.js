var chai = require("chai");
	chai.should();
	
describe("Yoyaku",function() {
	
	it("should be able to wrap a function without error",function(done) {
		var promise = require(__dirname + "/../yoyaku.js");
		
		var myfunc = promise(["p1","p2"],function(promises) {
			process.nextTick(function() {
				promises.p1();
				promises.p2();
			});
		});
		
		var callbacksFired = 0;
		
		myfunc.should.be.a("function");
		
		var promiseReturned = myfunc();
		promiseReturned.should.be.an("object");
		promiseReturned.p1.should.be.a("function");
		promiseReturned.p2.should.be.a("function");
		
		var funcCallback = function() {
			callbacksFired ++;
			
			if (callbacksFired === 2) done();
		};
		
		promiseReturned.p1(funcCallback).p2.should.be.a("function");
		promiseReturned.p2(funcCallback);
	});
	
});