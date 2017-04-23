#!/usr/bin/env node
'use strict';

var program = require('commander');
var format = require('../lib/format');

var command;

program
  .version('0.2.0')
  .option('-q, --quiet', 'Supress output of command return value')
  .arguments('<command>')
  .action(function (cmd) {
    command = cmd;
  })
  .parse(process.argv);

var options = {
  quiet: program.quiet,
};

var data = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    data += chunk;
  }
});

process.stdin.on('end', function () {
  var result = format.runFormat(data, command, options);

  if (result !== null) {
    console.log(result);
  }
});
