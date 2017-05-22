'use strict';

const expect = require('chai').expect;
const spawn = require('cross-spawn');

const jowlCommand = 'src/bin/index.js';

function runCommand(command, args, stdin, callback) {
  const child = spawn(command, args);
  let stdout;
  let stderr;

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  if (stdin !== null) {
    child.stdin.write(stdin);
  }

  child.stdin.end();

  child.stdout.on('data', (data) => {
    if (data != null) {
      stdout = stdout == null ? data : stdout + data;
    }
  });

  child.stderr.on('data', (data) => {
    if (data != null) {
      stderr = stderr == null ? data : stderr + data;
    }
  });

  child.on('close', (status) => {
    callback(
      status === 0,
      {
        status,
        stdout,
        stderr,
      }
    );
  });
}

describe('jowl cli', () => {
  it('should run', (done) => {
    runCommand(jowlCommand, [
      'd[0]',
    ], '["one", "two"]', (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout', '"one"\n');
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should handle chains within the command', (done) => {
    runCommand(jowlCommand, [
      '_.chain({key: {foo: c}, array: ["bar", c]})',
    ], '"one"', (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout', `${JSON.stringify({
        key: {
          foo: 'one',
        },
        array: [
          'bar',
          'one',
        ],
      }, null, 4)}\n`);
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should print using p', (done) => {
    runCommand(jowlCommand, [
      'p(d[0])',
    ], '["one", "two"]', (err, result) => {
      // It is not defined whether p or the value will be printed first
      expect(result).to.have.property('stdout').that.contains(
        'one\n', 'output of p'
      );
      expect(result).to.have.property('stdout').that.contains(
        '"one"\n', 'output of value'
      );
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  describe('in quiet mode', () => {
    it('should supress output of expression return value', (done) => {
      runCommand(jowlCommand, [
        '-q',
        'd[0]',
      ], '["one", "two"]', (err, result) => {
        expect(result).to.have.property('stdout').that.is.undefined;
        expect(result).to.have.property('status', 0);
        expect(result).to.have.property('stderr').that.is.undefined;

        done();
      });
    });

    it('should still print using p', (done) => {
      runCommand(jowlCommand, [
        '--quiet',
        'p(d[0])',
      ], '["one", "two"]', (err, result) => {
        expect(result).to.have.property('stdout', 'one\n');
        expect(result).to.have.property('status', 0);
        expect(result).to.have.property('stderr').that.is.undefined;

        done();
      });
    });

    it('should still print using a chain', (done) => {
      runCommand(jowlCommand, [
        '-q',
        'c.each(p)',
      ], '["one", "two"]', (err, result) => {
        expect(result).to.have.property('stdout', 'one\ntwo\n');
        expect(result).to.have.property('status', 0);
        expect(result).to.have.property('stderr').that.is.undefined;

        done();
      });
    });
  });

  it('should have --help', (done) => {
    runCommand(jowlCommand, [
      '--help',
    ], null, (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout').to.contain('--help');
      expect(result).to.have.property('stdout').to.contain('reference');
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should treat no command as passthrough', (done) => {
    runCommand(jowlCommand, [], '["one", "two"]', (err, result) => {
      const jsonFormatted = '[\n    "one",\n    "two"\n]\n';
      expect(result).to.have.property('stdout', jsonFormatted);
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('status', 0);

      done();
    });
  });
});
