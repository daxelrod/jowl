'use strict';

var expect = require('chai').expect;
var _ = require('lodash');
var run = require('../../../src/lib/run');

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
      expect(run.run(data, '["foo"]')).to.eql(['foo']);
    });

    it('should handle an object', function() {
      expect(
        run.run(data, '{"foo": "bar"}')
      ).to.eql({ foo: 'bar' });
    });

    describe('provided variables to the command', function() {
      it('should include parsed data as "d"', function() {
        expect(
          run.run(data, '{"word": d[1].words[0]}')
        ).to.eql({ word: 'baz' });
      });

      it('should include the chain as "c"', function() {
        expect(
          run.run(data, 'c.get(0).value()')
        ).to.eql(data[0]);
      });

      it('should include lodash as "_"', function() {
        expect(
          run.run(data, 'c.get("0.words").map(_.capitalize).value()')
        ).to.eql(['Foo', 'Bar']);
      });

      it('should not include other variables leaked into scope', function() {
        expect(
          _.bind(run.run, run, data, 'command')
        ).to.throw();
      });
    });
  });
});
