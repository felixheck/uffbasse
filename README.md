![uffbasse](logo.svg)

# uffbasse
#### Bouncing async/await wrapper for smart error handling


[![Travis](https://img.shields.io/travis/felixheck/uffbasse.svg)](https://travis-ci.org/felixheck/uffbasse/builds/) ![node](https://img.shields.io/node/v/uffbasse.svg) ![npm](https://img.shields.io/npm/dt/uffbasse.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/uffbasse.svg)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Example](#example)
4. [API](#api)
5. [Developing and Testing](#developing-and-testing)
6. [Contribution](#contribution)

---

## Introduction
**uffbasse** is an enhanced async/await wrapper for smart error handling and is based on the articles [Learning to Throw Again](https://hueniverse.com/learning-to-throw-again-79b498504d28) and 
[How to write async await without try-catch blocks in Javascript](https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/). So it returns a `[err, result]` array quite similar to the error-first callbacks. Like described in the articles using async/await both run-time and developer errors are merged into one single channel. **uffbasse** enables to differ between types of errors and behave based on this distinction. There are basically three behaviours:

1. promise resolves  
returns `[null, result]`
2. promise rejects with a matching error  
returns `[err, undefined]`
3. promise rejects with a non-matching error  
returns `[null, defaultResult]` and logs the error

The modules [`standard`](https://standardjs.com/) and [`ava`](https://github.com/avajs/ava) are used to grant a high quality implementation.<br/>
**uffbasse** is the Swabian translation for *take care*.

## Installation
For installation use the [Node Package Manager ⇗](https://github.com/npm/npm):
```
$ npm install --save uffbasse
```

or clone the repository:
```
$ git clone https://github.com/felixheck/uffbasse
```

## Example
#### With uffbasse
``` js
const to = require('uffbasse');

const succeeded = Promise.resolve({ test: 123 });
const failedMatched = Promise.reject(new SyntaxError('foobar'));
const failedNonMatched = Promise.reject(new Error('foobar'));

(async () => {
  await to(succeeded);
  // returns: [null, { test: 123 }]

  await to(failedMatched);
  // returns: ['SyntaxError: foobar', undefined]

  const [err, res] = await to(failedMatched);
  if (err) throw err;
  // returns: ['SyntaxError: foobar', undefined]
  // throws:   'SyntaxError: foobar'

  await to(failedNonMatched);
  // logs: foobar
  // returns: [null, undefined]

  await to(failedNonMatched, { defaults: {} });
  // logs: foobar
  // returns: [null, {}]
})();
```
#### Without uffbasse
``` js
const bounce = require('bounce');

const succeeded = Promise.resolve({ test: 123 });
const failedMatched = Promise.reject(new SyntaxError('foobar'));
const failedNonMatched = Promise.reject(new Error('foobar'));

(async () => {
  let res;

  try {
    res = await succeeded;
  } catch(err) {
    bounce.rethrow(err, 'system');
    console.error(err);
  }

  try {
    res = await failedMatched;
  } catch(err) {
    bounce.rethrow(err, 'system');
    console.error(err);
  }

  try {
    res = await failedNonMatched;
  } catch(err) {
    bounce.rethrow(err, 'system');
    console.error(err);
    res = {}
  }
})();
```

## API
`uffbasse(promise, [options])`: Returns a `[err, result]` array.

- `promise {Promise}`: The promise to be handled  
Required.
- `options {Object}`: Additional options to customize the behaviour.  
Optional.


  - `defaults {*}`: Default value to be returned if it is a non-matching error.  
  Optional. Default: `undefined`.
  - `log {null|Function}`: Function utilized to log non-matching errors. If `null`, logging is disabled.
  Optional. Default: `console.error`.
  - `is {Function}`: Function utilized to distinct between error types.  
  Optional. Default: [`bounce.isSystem`](https://github.com/hapijs/bounce).

By default it just returns run-time errors.  
Errors due to developers are logged with `console.error`.

## Developing and Testing
First you have to install all dependencies:
```
$ npm install
```

To execute all unit tests once, use:
```
$ npm test
```

or to run tests based on file watcher, use:
```
$ npm start
```

To get information about the test coverage, use:
```
$ npm run coverage
```

## Contribution
Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up 100% test coverage.<br/>
For further information read the [contributing guideline](CONTRIBUTING.md).
