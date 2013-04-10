var chai = require("chai");
	chai.should();

describe("Curry method",function() {

	it("should be able to curry a function with an arbitrary number of args",function() {
	
		var yoyaku = require(__dirname + "/../yoyaku.js");
		
		function curried() {
			arguments.length.should.equal(6);
			arguments[0].should.equal(1);
			arguments[1].should.equal(2);
			arguments[2].should.equal(3);
			arguments[3].should.equal(4);
			arguments[4].should.equal(5);
			arguments[5].should.be.an("object");
		}
		
		var wrapped = yoyaku([],curried);
		
		wrapped.curry.should.be.a("function");
		wrapped.curry(5).should.be.a("function");
		wrapped.curry(5)(1).should.be.a("function");
		wrapped.curry(5)(1)(2).should.be.a("function");
		wrapped.curry(5)(1)(2)(3).should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4).should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4)(5).should.be.an("object");
		
	});
	
	it("should maintain availability of promise setters at each curry stage",function() {
	
		var yoyaku = require(__dirname + "/../yoyaku.js");
		
		var wrapped = yoyaku(["setter1","setter2"],function() {});
		
		wrapped.curry.should.be.a("function");
		wrapped.curry(5).should.be.a("function");
		wrapped.curry(5)(1).setter1.should.be.a("function");
		wrapped.curry(5)(1).setter2.should.be.a("function");
		wrapped.curry(5)(1)(2).should.be.a("function");
		wrapped.curry(5)(1)(2).setter1.should.be.a("function");
		wrapped.curry(5)(1)(2).setter2.should.be.a("function");
		wrapped.curry(5)(1)(2)(3).should.be.a("function");
		wrapped.curry(5)(1)(2)(3).setter1.should.be.a("function");
		wrapped.curry(5)(1)(2)(3).setter2.should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4).should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4).setter1.should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4).setter2.should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4)(5).should.be.an("object");
		wrapped.curry(5)(1)(2)(3)(4)(5).setter1.should.be.a("function");
		wrapped.curry(5)(1)(2)(3)(4)(5).setter2.should.be.a("function");
		
	});
	
});