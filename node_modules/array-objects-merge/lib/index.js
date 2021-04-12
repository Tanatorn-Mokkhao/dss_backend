module.exports = (opts, ...sources) => {
  const { key = 'id' } = opts;

  const concat = [].concat(...sources);

  return concat.map((item) => concat.reduce((accumulator, current, index) => {
    if (current[key] === item[key]) {
      Object.assign(accumulator, current);
      delete concat[index];
    }

    return accumulator;
  }, {})).filter(Boolean);
};
