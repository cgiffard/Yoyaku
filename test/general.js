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
	
	it("should be able to wrap fs.readFile with yepnope",function(done) {
		var promise = require(__dirname + "/../yoyaku.js");
		
		var read = promise.yepnope(require("fs").readFile);
		
		read.should.be.a("function");
		
		read(__dirname + "/../package.json")
			.yep(function(data) {
				if (data) return done();
				throw new Error("Data field was empty.");
			});
	});
	
	it("should be able to catch errors with yepnope",function(done) {
		var promise = require(__dirname + "/../yoyaku.js");
		
		var read = promise.yepnope(require("fs").readFile);
		
		read(__dirname + Math.random())
			.nope(function(err) {
				err.should.be.an("error");
				done();
			});
	});
	
	it("should be able to yepnope-wrap an API object",function(done) {
		var promise	= require(__dirname + "/../yoyaku.js"),
			fs		= promise.api(require("fs")),
			read	= fs.readFile;
		
		read.should.be.a("function");
		
		read(__dirname + "/../package.json")
			.yep(function(data) {
				if (data) return done();
				throw new Error("Data field was empty.");
			});
	});
	
});