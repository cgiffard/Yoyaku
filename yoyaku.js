// Yoyaku
// Christopher Giffard, 2013 (BSD)

// Extremely simple method to avoid callback hell.
// Turns simple function calls into a pseudo-promise API.
// You can build a complete promise API with this if you want to.

;(function(glob) {

	// Function for decoupling execution of the wrapped function from the
	// runlloop, giving time for promises to be set, both in the browser & node
	var wait = 
		(process && process.nextTick) ? process.nextTick :
		function(inFunc) {
			setTimeout(inFunc,0);
		};

	// Expects the first parameter to be an array of promise names
	function yoyaku(promises,wrappedFunc) {

		var defaultFunctionMap = {}, promiseArr = [];

		// Has the user specified an array with default
		// functions for each promise?
		if (!(promises instanceof Array) && typeof promises === "object") {
			for (var promise in promises) {
				if (promises.hasOwnProperty(promise)) {
					defaultFunctionMap[promise] = promises[promise];
					promiseArr.push(promise);
				}
			}

			promises = promiseArr;
			
		} else if (promises instanceof Array) {
			promiseArr = promises;
		}

		var retFunc = function() {

			var promiseMap = {},
				returnedPromiseMap = {};

			promises.forEach(function(promise) {

				promiseMap[promise] =
					(defaultFunctionMap[promise] || function() {});

				returnedPromiseMap[promise] = function(funcIn) {
					if (funcIn instanceof Function) {
						promiseMap[promise] = funcIn;
						return returnedPromiseMap;
					}

					// We didn't get a function?
					throw new Error("Promises expect a function.");
				}

			});

			var args = [].slice.call(arguments,0);
				args.push(promiseMap);

			wait(function() {
				wrappedFunc.apply(wrappedFunc,args);
			});

			return returnedPromiseMap;
		};

		retFunc.defer = function() {
			var args = [].slice.call(arguments,0),
				promiseCache = {};

			var deferCallback = function() {
				var promiseObject = retFunc.apply(null,args);

				promiseArr.forEach(function(promise) {
					if (promiseCache[promise] instanceof Function)
						promiseObject[promise](promiseCache[promise]);
				});

				return promiseObject;
			};

			promiseArr.forEach(function(promise) {
				deferCallback[promise] = function(funcIn) {
					promiseCache[promise] = funcIn;
					return deferCallback;
				};
			});

			return deferCallback;
		};

		return retFunc;
	}

	// Simple function to easily promise-ify node's (and other libraries')
	// first-arg--is-err-or-it-was-a-great-success type callbacks
	yoyaku.yepnope = function(func,objectRef) {
		function yepnopeCallback() {
			var args		= [].slice.call(arguments,0),
				inputs		= args.slice(0,args.length-1),
				promises	= args.pop();

			args.push(function(err) {
				if (err) return promises.nope(err);

				// If it worked, we pass through everything except the null
				// error argument.
				promises.yep.apply(promises,[].slice.call(arguments,1));
			});

			try {
				func.apply(objectRef,args);
			} catch(err) {
				promises.nope(err);
			}
		}

		// By default, nope should throw the exception it gets.
		return yoyaku(
			{
				"yep": function() {},
				"nope": function(err) {
					throw err;
				}
			},
			yepnopeCallback);
	};

	// Apply yepnope to a whole API (such as node FS, or async)
	// API surface must be iterable...
	yoyaku.api = function(oldAPI) {
		var newAPI = {};

		for (var apiKey in oldAPI)
			if (oldAPI.hasOwnProperty(apiKey))
				newAPI[apiKey] = yoyaku.yepnope(oldAPI[apiKey],oldAPI);

		return newAPI;
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