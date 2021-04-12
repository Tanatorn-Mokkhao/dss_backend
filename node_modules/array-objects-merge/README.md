# array-objects-merge

[![build state](https://travis-ci.com/gAmadorH/array-objects-merge.svg?branch=master)](https://travis-ci.com/gAmadorH/array-objects-merge)
[![vulnerabilities](https://snyk.io/test/github/gAmadorH/array-objects-merge/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gAmadorH/array-objects-merge?targetFile=package.json)
[![coverage status](https://coveralls.io/repos/github/gAmadorH/array-objects-merge/badge.svg)](https://coveralls.io/github/gAmadorH/array-objects-merge)
[![dependencies status](https://david-dm.org/gAmadorH/array-objects-merge.svg)](https://david-dm.org/gAmadorH/array-objects-merge)
[![dev dependencies status](https://david-dm.org/gAmadorH/array-objects-merge/dev-status.svg)](https://david-dm.org/gAmadorH/array-objects-merge#info=devDependencies)
[![license](https://img.shields.io/github/license/gAmadorH/array-objects-merge.svg?color=blue)](https://github.com/gAmadorH/array-objects-merge/blob/master/LICENSE)
[![style guide](https://img.shields.io/badge/code_style-eslint-blueviolet.svg)](https://eslint.org/)
[![style guide](https://img.shields.io/badge/style_guide-airbnb-ff69b4.svg)](https://eslint.org/)

Merge arrays of objects where object are the same based on your own defined key

## Install

```bash
npm i -S array-objects-merge
```

## Usage

Merge many arrays of objects only write

```js
const arrMerge = require('array-objects-merge');

const opt = { key: 'id' };

// key equals to 'id' is by default
const merge = arrMerge(opt, source1, source2, source3, ...);

// so you can do only
const merge = arrMerge({}, source1, source2, source3, ...);
```

The first `opts` object is required, don't try to skip or `array-objects-merge` skip your first source

## Example

Make a file and insert the next content and run:

```js
const arrMerge = require('array-objects-merge');

const source1 = [
  { id: 1, name: 'Andrea' },
  { id: 2, name: 'Marlen' },
  { id: 3, name: 'Mare' },
  { id: 4, name: 'Elyn' },
];

const source2 = [
  { id: 1, age: 15 },
  { id: 2, age: 23 },
  { id: 3, age: 17 },
  { id: 4, age: 19 },
];

const source3 = [
  { id: 1, hobbies: ['dancing', 'movies', 'write', 'yoga'] },
  { id: 2, hobbies: ['ballet', 'dancing', 'athletics', 'running'] },
  { id: 3, hobbies: ['soccer', 'volleyball'] },
  { id: 4, hobbies: ['running', 'swimming', 'study'] },
];

// merge by id property
const merge = arrMerge({ key: 'id' }, source1, source2, source3);

console.log(merge);
```

output:

```bash
[
  {
    id: 1,
    name: 'Andrea',
    age: 15,
    hobbies: ['dancing', 'movies', 'write', 'yoga']
  },
  {
    id: 2,
    name: 'Marlen',
    age: 23,
    hobbies: ['ballet', 'dancing', 'athletics', 'running']
  },
  {
    id: 3,
    name: 'Mare',
    age: 17,
    hobbies: ['soccer', 'volleyball']
  },
  {
    id: 4,
    name: 'Elyn',
    age: 19,
    hobbies: ['running', 'swimming', 'study']
  },
]
```


## License

[MIT.](./LICENSE) Copyright (c)
