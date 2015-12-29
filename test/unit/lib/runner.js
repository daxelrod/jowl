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

    it('should handle a basic expression', function() {
      expect(runner.run(data, '["foo"]')).to.eql(['foo']);
    });

    it('should handle an object', function() {
      expect(
        runner.run(data, '{"foo": "bar"}')
      ).to.eql({foo:'bar'});
    });

    describe('provided variables to the command', function() {
      it('should include parsed data as "d"', function() {
        expect(
          runner.run(data, '{"word": d[1].words[0]}')
        ).to.eql({word: 'baz'});
      });

      it('should include the chain as "c"', function() {
        expect(
          runner.run(data, 'c.get(0).value()')
        ).to.eql(data[0]);
      });

      it('should include lodash as "_"', function() {
        expect(
          runner.run(data, 'c.get("0.words").map(_.capitalize)')
        ).to.eql(['Foo', 'Bar']);
      });

      it('should not include other variables leaked into scope', function() {
        expect(
          _.bind(runner.run, runner, data, 'command')
        ).to.throw();
      });
    });

    it('should call value() on a returned chain object', function() {
      expect(
        runner.run(data, 'c.get(0)')
      ).to.eql(data[0]);
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
