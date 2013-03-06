// Yoyaku
// Christopher Giffard, 2013 (BSD)

// Extremely simple method to avoid callback hell.
// Turns simple function calls into a pseudo-promise API.
// You can build a complete promise API with this if you want to.

;(function(glob) {
	
	// Expects the first parameter to be an array of promise names
	function yoyaku(promises,wrappedFunc) {
	
		var promiseMap = {},
			returnedPromiseMap = {};
	
		promises.forEach(function(promise) {
	
			promiseMap[promise] = function() {};
	
			returnedPromiseMap[promise] = function(funcIn) {
				if (funcIn instanceof Function) {
					promiseMap[promise] = funcIn;
					return returnedPromiseMap;
				}
	
				// We didn't get a function?
				throw new Error("Promises expect a function.");
			}
	
		});
	
		return function() {
	
			var args = [].slice.call(arguments,0);
				args.push(promiseMap);
	
			wrappedFunc.apply(wrappedFunc,args);
	
			return returnedPromiseMap;
		};
	}
	
	// Simple function to easily promise-ify node's (and other libraries')
	// first-arg--is-err-or-it-was-a-great-success type callbacks
	yoyaku.yepnope = function(func,objectRef) {
		return yoyaku(["yep","nope"],function() {
			var args		= [].slice.call(arguments,0),
				inputs		= args.slice(0,args.length-2),
				promises	= args.pop();
			
			args.push(function(err) {
				if (err) return promises.nope(err);
				
				// If it worked, we pass through everything except the null
				// error argument.
				promises.yep.apply([].slice.call(arguments,1));
			});
			
			try {
				func.apply(objectRef,args);
			} catch(err) {
				promises.nope(err);
			}
		});
	};
	
	// Publish existence of object
	if (typeof module !== "undefined" && module.exports) {
		module.exports = yoyaku;
	} else if (typeof define !== "undefined") {
		 define("vixen", [], function() { return yoyaku; });
	} else {
		glob.yoyaku = yoyaku;
	}
})(this);