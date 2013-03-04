Yoyaku
======

Avoid callback hell with this ultra-simple wrapper for your functions.

### Example

```javascript
var promise = require("yoyaku");

function existsInt(file,promises) {
	fs.stat(file,function(err,data) {
		if (err) return promises.enoent();
		
		promises.exists(data);
	});
}

var exists = promise(["exists","enoent"],existsInt);

exists("./foo.txt")
	.exists(successFunc)
	.enoent(failFunc);
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
