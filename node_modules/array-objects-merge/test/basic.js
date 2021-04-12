const tap = require('tap');
const lib = require('../lib');

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

const expected = [
  {
    id: 1,
    name: 'Andrea',
    age: 15,
    hobbies: ['dancing', 'movies', 'write', 'yoga'],
  },
  {
    id: 2,
    name: 'Marlen',
    age: 23,
    hobbies: ['ballet', 'dancing', 'athletics', 'running'],
  },
  {
    id: 3,
    name: 'Mare',
    age: 17,
    hobbies: ['soccer', 'volleyball'],
  },
  {
    id: 4,
    name: 'Elyn',
    age: 19,
    hobbies: ['running', 'swimming', 'study'],
  },
];

tap.test('simple merge by id property', (childTest) => {
  childTest.plan(1);

  const merge = lib({ key: 'id' }, source1, source2, source3);

  childTest.deepEqual(merge, expected);
});
