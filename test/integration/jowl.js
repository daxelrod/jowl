'use strict';

const { expect } = require('chai');
const globalChalk = require('chalk');
const spawn = require('cross-spawn');

const jowlCommand = 'src/bin/jowl.js';

function runCommand(command, args, stdin, env, callback) {
  const defaultEnv = {
    HOME: process.env.HOME,
    PATH: process.env.PATH,
    SHELL: process.env.shell,
  };

  const commandEnv = Object.assign(defaultEnv, env);

  const child = spawn(command, args, { env: commandEnv });
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

function generateColorString(chalkLevel) {
  const chalk = new globalChalk.constructor({ level: chalkLevel });
  return `${chalk.reset('{')}
  ${chalk.cyan('"STRING_LITERAL"')}${chalk.reset(':')} ${chalk.reset('"yay a string"')}${chalk.gray(',')}
  ${chalk.cyan('"NUMBER_LITERAL"')}${chalk.reset(':')} ${chalk.green.bold('12.1')}${chalk.gray(',')}
  ${chalk.cyan('"BOOLEAN_LITERAL"')}${chalk.reset(':')} ${chalk.magenta('true')}${chalk.gray(',')}
  ${chalk.cyan('"NULL_LITERAL"')}${chalk.reset(':')} ${chalk.red('null')}${chalk.gray(',')}
  ${chalk.cyan('"BRACKET"')}${chalk.reset(':')} ${chalk.reset('[')}${chalk.reset(']')}
${chalk.reset('}')}`;
}

describe('jowl cli', () => {
  it('should run', (done) => {
    runCommand(jowlCommand, [
      'd[0]',
    ], '["one", "two"]', {}, (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout', '"one"\n');
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should handle chains within the command', (done) => {
    runCommand(jowlCommand, [
      '_.chain({key: {foo: c}, array: ["bar", c]})',
    ], '"one"', {}, (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout', `${JSON.stringify({
        key: {
          foo: 'one',
        },
        array: [
          'bar',
          'one',
        ],
      }, null, 2)}\n`);
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should print using p', (done) => {
    runCommand(jowlCommand, [
      'p(d[0])',
    ], '["one", "two"]', {}, (err, result) => {
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
      ], '["one", "two"]', {}, (err, result) => {
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
      ], '["one", "two"]', {}, (err, result) => {
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
      ], '["one", "two"]', {}, (err, result) => {
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
    ], null, {}, (err, result) => {
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('stdout').to.contain('--help');
      expect(result).to.have.property('stdout').to.contain('reference');
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  it('should treat no command as passthrough', (done) => {
    runCommand(jowlCommand, [], '["one", "two"]', {}, (err, result) => {
      const jsonFormatted = '[\n  "one",\n  "two"\n]\n';
      expect(result).to.have.property('stdout', jsonFormatted);
      expect(result).to.have.property('stderr').that.is.undefined;
      expect(result).to.have.property('status', 0);

      done();
    });
  });

  describe('color support', () => {
    it('should output syntax-highlighted color when --color is passed', (done) => {
      // Since we are deliberately using colors that are part of the 16 color set,
      // chalk will output the same colors in every level other than 0
      runCommand(jowlCommand, ['--color'], generateColorString(0), {}, (err, result) => {
        expect(result).to.have.property('stdout', `${generateColorString(1)}\n`);
        expect(result).to.have.property('stderr').that.is.undefined;
        expect(result).to.have.property('status', 0);

        done();
      });
    });

    it('should not output color when -no-color is passed', (done) => {
      // Since tests set up STDOUT to not-a-tty, we'd expect this same
      // behavior without the flag. It's still valuable to test that
      // the flag exists.
      runCommand(jowlCommand, ['--no-color'], generateColorString(0), {}, (err, result) => {
        expect(result).to.have.property('stdout', `${generateColorString(0)}\n`);
        expect(result).to.have.property('stderr').that.is.undefined;
        expect(result).to.have.property('status', 0);

        done();
      });
    });

    it('should output syntax-highlighted color when FORCE_COLOR=1 is passed', (done) => {
      // Since we are deliberately using colors that are part of the 16 color set,
      // chalk will output the same colors in every level other than 0
      runCommand(jowlCommand, [], generateColorString(0), { FORCE_COLOR: 1 }, (err, result) => {
        expect(result).to.have.property('stdout', `${generateColorString(1)}\n`);
        expect(result).to.have.property('stderr').that.is.undefined;
        expect(result).to.have.property('status', 0);

        done();
      });
    });

    it('should not output color when FORCE_COLOR=0 is passed, even when --color is passed', (done) => {
      runCommand(jowlCommand, ['--color'], generateColorString(0), { FORCE_COLOR: 0 }, (err, result) => {
        expect(result).to.have.property('stdout', `${generateColorString(0)}\n`);
        expect(result).to.have.property('stderr').that.is.undefined;
        expect(result).to.have.property('status', 0);

        done();
      });
    });
  });
});
