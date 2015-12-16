#!/usr/bin/env node
'use strict';

var program = require('commander');
var runner = require('../lib/runner');

var command;

program
  .version('0.0.1')
  .option('-c, --chain', 'Start chain with data')
  .arguments('<command>')
  .action(function(cmd) {
    command = cmd;
  })
  .parse(process.argv);

var options = {
  chain: program.chain,
};

var data = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    data += chunk;
  }
});

process.stdin.on('end', function() {
  var result = runner.runJson(data, command, options);
  console.log(result);
});
