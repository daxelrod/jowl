'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var format = require('../../../src/lib/format');
var run = require('../../../src/lib/run');

describe('formatting library', function() {
  describe('runFormat method', function() {
    beforeEach(function() {
      sinon.spy(run, 'run');
    });

    afterEach(function() {
      run.run.restore();
    });

    var json = '["one", "two"]';

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
