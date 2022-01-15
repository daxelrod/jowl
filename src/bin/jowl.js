#!/usr/bin/env node

'use strict';

const program = require('commander');
const format = require('../lib/format');

let command;

program
  .version('2.0.0')
  .option('-q, --quiet', 'Supress output of command return value')
  .option('--color', 'Always produce color output even if STDOUT would not support it')
  .option('--no-color', 'Never produce color output even if STDOUT would support it')
  .arguments('[command]')
  .action((cmd) => {
    command = cmd;
  })
  .on('--help', () => {
    console.log(
      '  Jowl is a command-line filter for JSON expressions that uses\n'
      + '  JavaScript with Lodash as its command argument.\n'
      + '\n'
      + '  It takes JSON on standard in and writes JSON to standard out.\n'
      + '\n'
      + '  For a complete reference, see\n'
      + '  https://github.com/daxelrod/jowl/blob/master/docs/reference.md'
    );
  })
  .parse(process.argv);

const options = {
  quiet: program.quiet,
};

if (command == null) {
  // If no command was specified, pass through the JSON and act as a pretty-printer
  command = 'd';
}

let data = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    data += chunk;
  }
});

process.stdin.on('end', () => {
  const result = format.runFormat(data, command, options);

  if (result !== null) {
    console.log(result);
  }
});
