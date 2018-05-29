# mr-base
split stdio as test line

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/mr-base.svg
[npm-url]: https://npmjs.com/package/mr-base
[download-image]: https://img.shields.io/npm/dm/mr-base.svg
[download-url]: https://npmjs.com/package/mr-base
[david-image]: https://img.shields.io/david/imcooder/mr-base.svg
[david-url]: https://david-dm.org/imcooder/mr-base

## Install

```
npm i mr-base -S
```

## Usage

```js
const mr = require('mr-base');
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
