Yoyaku
======

*	Avoid callback hell with this ultra-simple wrapper for your functions.
*	Easily streamline node's first-argument-as-error style callbacks.
*	Automatically wrap entire APIs, such as node's `fs`.
*	Delayed execution: passing a function call without ugly `function(){}` syntax.
	(See [example](#delayed-execution))

*Serving suggestion*: combine with [async](http://github.com/caolan/async) for
added flavour (see [recipe](#async).)

### Example 1

In one line of code, turn node's fs.stat into a promise-like API! Toss `if (err)`
to the curb!

```javascript

var yoyaku = require("yoyaku");

var exists = yoyaku.yepnope(require("fs").stat);

// Now, use it!
exists("foo.txt")
	.nope(function() {
		console.log("No - we'd better create that file!");
	})
	.yep(function() {
		console.log("Yeah my file exists!");
	})

```

### Example 2

The more flexible method that allows *any* function to be wrapped:

```javascript
var yoyaku = require("yoyaku");

function existsInt(file,promises) {
	fs.stat(file,function(err,data) {
		if (err) return promises.enoent();
		
		promises.exists(data);
	});
}

var exists = yoyaku(["exists","enoent"],existsInt);

exists("./foo.txt")
	.exists(successFunc)
	.enoent(failFunc);
```

### Example 3

Automatically wrapping an entire API for easy promisey access:

```javascript
var yoyaku	= require("yoyaku"),
	fs		= yoyaku.api(require("fs"));

fs.readFile("foo.txt")
	.yep(function(data) {
		// do something with the file data
	});

```

### Installing

If you're using it in the browser, simply include yoyaku.js in your page.

If you're using node, simply `npm install yoyaku`.

### About

This won't banish callback hell completely. But used in conjunction with other
techniques, it'll certainly help.

`Yoyaku` does not mean promise in Japanese - it means 'reservation', 'contract',
or 'agreement'. Since this isn't strictly a *promise* API, rather, a *promise-like*
API, I decided to use a promise-like word to describe it. Hence, yoyaku.

### Async

I find this makes async much more palatable. This is a very small example that I
think demonstrates how Yoyaku cleans up the callback syntax.

```javascript

var yoyaku	= require("yoyaku"),
	async	= yoyaku.api(require("async")),
	fs		= require("fs"),
	write	= yoyaku.yepnope(fs.writeFile),
	each	= async.each;

files = [ "foo.txt", "bar.txt", "baz.txt" ];

each(files,fs.readFile)
	.yep(function(data) {
		write("combined.txt",data.join("\n"))
			.yep(somethingToDoWhenFinished);
	});

function somethingToDoWhenFinished() {
	console.log("It all worked awesomely!")
}

```

### Delayed execution

Delayed execution lets you omit function-expression syntax when passing wrapped
functions as callbacks. Instead of calling the function directly, call `.delay`
on it and pass in the arguments you normally would.

Take this example for instance:

```javascript

var yoyaku	= require("yoyaku"),
	mkdirp	= yoyaku.yepnope(require("mkdirp")),
	exists	= yoyaku.yepnope(require("fs").stat);

function createDirIfMissing(path,callback) {
	exists(path)
		.yep(callback)
		.nope(
			mkdirp.delay(path)
				.yep(callback));
}
```

The function simply takes a filepath, and creates the directory specified by the
path if it does not already exist. Writing the function without delayed execution
and Yoyaku would look like:

```javascript

var mkdirp	= require("mkdirp"),
	fs		= require("fs");

function createDirIfMissing(path,callback) {
	fs.stat(path,function(err) {
		if (!err) return callback();
		
		mkdirp(path,function(err) {
			if (err) throw err;
			
			callback();
		});
	});
}
```

It's not the reduced line count (5 vs 7 SLOC) that is the main factor in Yoyaku's
favour - rather the terseness of the code, and the lack of non-specific cruft,
like handlers for error callbacks and function expressions. This has let me be
more expressive and feel less hindered by *callback-coding* in my own work. I hope
it works for you too.

### Function Reference

#### `yoyaku(promiseArray,function)`

Wraps a single function in another function that manages promises and callbacks.
Passes all the arguments the wrapper function was called with through to the
wrapped function, but adds an additional argument on the end: an map of functions
named according to the array which was passed to `yoyaku` when it was invoked.

#### `yoyaku.yepnope(function, [callwith])`

Automatically converts node-style callback APIs (callback as last parameter, error
condition passed as first parameter to callback if applicable) to a promise-like API.

The returned promises are `.yep` and `.nope`, hence the name of the method.

If you do not specify a handler for `.nope`, it will throw an exception should the
method fail. This is desirable behaviour (there's nothing worse than invisible errors
quietly multiplying inside a program!)

#### `yoyaku.api(object)`

Runs `yoyaku.yepnope` against every function parameter of an object, and saves the
newly wrapped functions on a new object. Essentially this converts an entire API
to a promise-like interface.

### Testing

	npm test

### Licence (BSD)

Copyright (c) 2013, Christopher Giffard
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

*	Redistributions of source code must retain the above copyright notice, this list
	of conditions and the following disclaimer.
*	Redistributions in binary form must reproduce the above copyright notice, this
	list of conditions and the following disclaimer in the documentation and/or
	other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
