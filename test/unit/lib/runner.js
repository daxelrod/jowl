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
      var options = {
        chain: false,
      };

      it('should handle a basic expression', function() {
        expect(runner.run(data, '["foo"]', options)).to.eql(['foo']);
      });

      it('should handle an object', function() {
        expect(
          runner.run(data, '{"foo": "bar"}', options)
        ).to.eql({foo:'bar'});
      });

      it('should provide the input as "d" to the command', function() {
        expect(
          runner.run(data, '{"word": d[1].words[0]}', options)
        ).to.eql({word: 'baz'});
      });

      it('should provide the chain as "c" to the command', function() {
        expect(
          runner.run(data, 'c.get(0).value()', options)
        ).to.eql(data[0]);
      });

      it('should not leak other variables into the command scope', function() {
        expect(
          _.bind(runner.run, runner, data, 'command', options)
        ).to.throw();
      });
    });

    describe('in chain mode', function() {
      var options = {
        chain: true,
      };

      it('should handle a basic lodash command', function() {
        expect(runner.run(data, 'get(0)', options)).to.eql(data[0]);
      });

      it('should handle several lodash commands strung together', function() {
        expect(runner.run(data, 'get("0.words").size()', options)).to.equal(2);
      });

      it('should provide lodash as "_" to the command', function() {
        expect(
          runner.run(data, 'get("0.words").map(_.capitalize)', options)
        ).to.eql(['Foo', 'Bar']);
      });

      it('should provide the input as "d" to the command', function() {
        expect(
          runner.run(data, 'findIndex("name", d[1].name)', options)
        ).to.equal(1);
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
    var options = {
      chain: true,
    };

    it('should pass arguments through to run method', function() {
      expect(
        runner.runJson(json, 'get(0)', options)
      ).to.equal('"one"');

      sinon.assert.calledOnce(runner.run);
      sinon.assert.calledWithExactly(
        runner.run,
        sinon.match(['one', 'two']),
        'get(0)',
        sinon.match(options)
      );
    });

    it('should pretty-print the output', function() {
      var json = JSON.stringify({
        a: 'b',
      });
      expect(
        runner.runJson(json, 'identity()', options)
      ).to.equal('{\n    "a": "b"\n}');
    });
  });
});
