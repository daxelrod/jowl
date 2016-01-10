'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var format = require('../../../src/lib/format');
var run = require('../../../src/lib/run');

describe('formatting library', function() {
  describe('parseInput method', function() {
    beforeEach(function() {
      sinon.spy(JSON, 'parse');
    });

    afterEach(function() {
      JSON.parse.restore();
    });

    it('should parse JSON by calling JSON.parse', function() {
      var json = '["one", "two"]';
      var result = format.parseInput(json);

      expect(result).to.deep.equal(['one', 'two']);
      sinon.assert.calledOnce(JSON.parse);
      sinon.assert.calledWithExactly(JSON.parse, sinon.match(json));
    });
  });

  describe('runFormat method', function() {
    beforeEach(function() {
      sinon.spy(run, 'run');
      sinon.spy(format, 'parseInput');
    });

    afterEach(function() {
      run.run.restore();
      format.parseInput.restore();
    });

    var json = '["one", "two"]';

    it('should use parseInput to parse input data', function() {
      format.runFormat(json);
      sinon.assert.calledOnce(format.parseInput);
      sinon.assert.calledWithExactly(format.parseInput, json);
    });

    it('should pass arguments through to run method', function() {
      expect(
        format.runFormat(json, 'd[0]')
      ).to.equal('"one"');

      sinon.assert.calledOnce(run.run);
      sinon.assert.calledWithExactly(
        run.run,
        sinon.match(['one', 'two']),
        'd[0]'
      );
    });

    it('should pretty-print the output', function() {
      var json = JSON.stringify({
        a: 'b',
      });
      expect(
        format.runFormat(json, 'd')
      ).to.equal('{\n    "a": "b"\n}');
    });
  });
});
