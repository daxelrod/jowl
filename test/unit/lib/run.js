'use strict';

var expect = require('chai').expect;
var _ = require('lodash');
var run = require('../../../src/lib/run');
var sinon = require('sinon');

describe('Command runner library', function () {
  describe('run method', function () {
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

    it('should handle a basic expression', function () {
      expect(run.run(data, '["foo"]')).to.eql(['foo']);
    });

    it('should handle an object', function () {
      expect(
        run.run(data, '{"foo": "bar"}')
      ).to.eql({ foo: 'bar' });
    });

    describe('provided variables to the command', function () {
      it('should include parsed data as "d"', function () {
        expect(
          run.run(data, '{"word": d[1].words[0]}')
        ).to.eql({ word: 'baz' });
      });

      it('should include the chain as "c"', function () {
        expect(
          run.run(data, 'c.get(0).value()')
        ).to.eql(data[0]);
      });

      it('should include lodash as "_"', function () {
        expect(
          run.run(data, 'c.get("0.words").map(_.capitalize).value()')
        ).to.eql(['Foo', 'Bar']);
      });

      describe('"p"', function () {
        beforeEach(function () {
          sinon.spy(console, 'json');
        });

        afterEach(function () {
          console.json.restore();
        });

        it('should include console.json as "p"', function () {
          // console.json does not document its return value,
          // so don't test for it
          run.run(data, 'p(d)');
          sinon.assert.calledOnce(console.json);
          sinon.assert.calledWithExactly(console.json, data);
        });

        it('should return the first item passed to it', function () {
          expect(
            run.run(data, 'p(d,d)')
          ).to.eql(data);
        });
      });

      it('should not include other variables leaked into scope', function () {
        expect(
          _.bind(run.run, run, data, 'command')
        ).to.throw();
      });
    });
  });
});
