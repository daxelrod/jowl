'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const format = require('../../../src/lib/format');
const run = require('../../../src/lib/run');

describe('formatting library', function () {
  describe('parseInput method', function () {
    beforeEach(function () {
      sinon.spy(JSON, 'parse');
    });

    afterEach(function () {
      JSON.parse.restore();
    });

    it('should parse JSON by calling JSON.parse', function () {
      const json = '["one", "two"]';
      const result = format.parseInput(json);

      expect(result).to.deep.equal(['one', 'two']);
      sinon.assert.calledOnce(JSON.parse);
      sinon.assert.calledWithExactly(JSON.parse, sinon.match(json));
    });
  });

  describe('formatOutput method', function () {
    beforeEach(function () {
      sinon.spy(JSON, 'stringify');
    });

    afterEach(function () {
      JSON.stringify.restore();
    });

    it('should pretty-print the output by calling JSON.stringify', function () {
      const data = { a: 'b' };
      expect(
        format.formatOutput(data, 'd')
      ).to.equal('{\n    "a": "b"\n}');

      sinon.assert.calledOnce(JSON.stringify);
      sinon.assert.calledWithExactly(
        JSON.stringify, sinon.match(data), null, 4
      );
    });
  });

  describe('runFormat method', function () {
    beforeEach(function () {
      sinon.spy(run, 'run');
      sinon.spy(format, 'parseInput');
      sinon.spy(format, 'formatOutput');
    });

    afterEach(function () {
      run.run.restore();
      format.parseInput.restore();
      format.formatOutput.restore();
    });

    const json = '["one", "two"]';
    const command = 'd[0]';

    it('should use parseInput to parse input data', function () {
      format.runFormat(json);
      sinon.assert.calledOnce(format.parseInput);
      sinon.assert.calledWithExactly(format.parseInput, json);
    });

    it('should pass arguments through to run method', function () {
      expect(
        format.runFormat(json, command)
      ).to.equal('"one"');

      sinon.assert.calledOnce(run.run);
      sinon.assert.calledWithExactly(
        run.run,
        sinon.match(['one', 'two']),
        command
      );
    });

    it('should use formatOutput to format the results', function () {
      format.runFormat(json, command);
      sinon.assert.calledOnce(format.formatOutput);
      sinon.assert.calledWithExactly(format.formatOutput, 'one');
    });

    it('should return null in quiet mode', function () {
      expect(
        format.runFormat(json, command, { quiet: true })
      ).to.be.null;
    });
  });
});
