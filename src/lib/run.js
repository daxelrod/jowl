const _ = require('lodash');
const vm = require('vm');
require('console.json'); // Injects itself directly into the console object

const run = {};

function p(data) {
  // intentionally limit to just one argument
  console.json(data); // returns undefined
  return data;
}

run.run = function run(data, command) {
  // Parens are needed to disambiguate that curly braces are an object and
  // not a block.
  const script = new vm.Script(`(${command})`, {
    filename: 'command',
  });

  return script.runInNewContext({
    _,
    p,
    d: data,
    c: _.chain(data),
  });
};

module.exports = run;
