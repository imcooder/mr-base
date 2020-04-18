# mr-base
split stdio as test line

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/@imcooder/mr-base.svg
[npm-url]: https://npmjs.com/package/@imcooder/mr-base
[download-image]: https://img.shields.io/npm/dm@imcooder/mr-base.svg
[download-url]: https://npmjs.com/package/@imcooder/mr-base
[david-image]: https://img.shields.io/david/imcooder/mr-base.svg
[david-url]: https://david-dm.org/imcooder/mr-base

## Install

```
npm i @imcooder/mr-base -S
```

## Usage

```js
parse.js

const MRBase = require('mr-base');
let mr = new MRBase();
let lineNumber = 0;
mr.on('line', line => {
    console.log(line);
	lineNumber ++;
});
mr.on('end', () => {
    console.log(lineNumber);
});
```
use:
```shell

cat test.log | node parse.js

```
## Example


## License

The [MIT License](LICENSE)
