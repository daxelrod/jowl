#!/usr/bin/env node
'use strict';

var program = require('commander');
var run = require('../lib/run');

var command;

program
  .version('0.2.0')
  .arguments('<command>')
  .action(function(cmd) {
    command = cmd;
  })
  .parse(process.argv);

var data = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    data += chunk;
  }
});

process.stdin.on('end', function() {
  var result = run.runJson(data, command);
  console.log(result);
});
