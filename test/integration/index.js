'use strict';

var expect = require('chai').expect;
var spawn = require('child_process').spawn;

var jowlCommand = 'src/bin/index.js';

function runCommand(command, args, stdin, callback) {
  var child = spawn(command, args);
  var stdout;
  var stderr;

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdin.write(stdin);
  child.stdin.end();

  child.stdout.on('data', function(data) {
    if (data != null) {
      stdout = stdout == null ? data : stdout + data;
    }
  });

  child.stderr.on('data', function(data) {
    if (data != null) {
      stderr = stderr == null ? data : stderr + data;
    }
  });

  child.on('close', function(status) {
    callback(
      status === 0,
      {
        status: status,
        stdout: stdout,
        stderr: stderr,
      }
    );
  });
}

describe('jowl cli', function() {
  it('should run in chain mode', function(done) {
    runCommand(jowlCommand, [
        '-c', 'get(0)',
      ], '["one", "two"]', function(err, result) {
      expect(result).to.have.property('stderr').that.is.undefined; // jshint ignore: line
      expect(result).to.have.property('stdout', '"one"\n');
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should run in value mode', function(done) {
    runCommand(jowlCommand, [
        'd[0]',
      ], '["one", "two"]', function(err, result) {
      expect(result).to.have.property('stderr').that.is.undefined; // jshint ignore: line
      expect(result).to.have.property('stdout', '"one"\n');
      expect(result).to.have.property('status', 0);

      done();
    });
  });
});
