'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var runner = require('../../../src/lib/runner');

describe('Command runner library', function() {
  describe('run method', function() {
    var data = [
      {
        name: 'first',
        words: ['foo', 'bar'],
      },
      {
        name: 'second',
        words: ['baz', 'quux'],
      },
    ];

    describe('in value mode', function() {
      it('should handle a basic expression', function() {
        expect(runner.run(data, '["foo"]')).to.eql(['foo']);
      });

      it('should handle an object', function() {
        expect(
          runner.run(data, '{"foo": "bar"}')
        ).to.eql({foo:'bar'});
      });

      it('should provide the input as "d" to the command', function() {
        expect(
          runner.run(data, '{"word": d[1].words[0]}')
        ).to.eql({word: 'baz'});
      });

      it('should provide the chain as "c" to the command', function() {
        expect(
          runner.run(data, 'c.get(0).value()')
        ).to.eql(data[0]);
      });

      it('should provide lodash as "_" to the command', function() {
        expect(
          runner.run(data, 'c.get("0.words").map(_.capitalize)')
        ).to.eql(['Foo', 'Bar']);
      });

      it('should call value() on a returned chain object', function() {
        expect(
          runner.run(data, 'c.get(0)')
        ).to.eql(data[0]);
      });

      it('should not leak other variables into the command scope', function() {
        expect(
          _.bind(runner.run, runner, data, 'command')
        ).to.throw();
      });
    });
  });

  describe('runJson method', function() {
    beforeEach(function() {
      sinon.spy(runner, 'run');
    });

    afterEach(function() {
      runner.run.restore();
    });

    var json = '["one", "two"]';

    it('should pass arguments through to run method', function() {
      expect(
        runner.runJson(json, 'd[0]')
      ).to.equal('"one"');

      sinon.assert.calledOnce(runner.run);
      sinon.assert.calledWithExactly(
        runner.run,
        sinon.match(['one', 'two']),
        'd[0]'
      );
    });

    it('should pretty-print the output', function() {
      var json = JSON.stringify({
        a: 'b',
      });
      expect(
        runner.runJson(json, 'd')
      ).to.equal('{\n    "a": "b"\n}');
    });
  });
});
