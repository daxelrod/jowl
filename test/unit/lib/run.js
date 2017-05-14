'use strict';

const expect = require('chai').expect;
const _ = require('lodash');
const run = require('../../../src/lib/run');
const sinon = require('sinon');

describe('Command runner library', () => {
  describe('run method', () => {
    const data = [
      {
        name: 'first',
        words: ['foo', 'bar'],
      },
      {
        name: 'second',
        words: ['baz', 'quux'],
      },
    ];

    it('should handle a basic expression', () => {
      expect(run.run(data, '["foo"]')).to.eql(['foo']);
    });

    it('should handle an object', () => {
      expect(
        run.run(data, '{"foo": "bar"}')
      ).to.eql({ foo: 'bar' });
    });

    describe('provided variables to the command', () => {
      it('should include parsed data as "d"', () => {
        expect(
          run.run(data, '{"word": d[1].words[0]}')
        ).to.eql({ word: 'baz' });
      });

      it('should include the chain as "c"', () => {
        expect(
          run.run(data, 'c.get(0).value()')
        ).to.eql(data[0]);
      });

      it('should include lodash as "_"', () => {
        expect(
          run.run(data, 'c.get("0.words").map(_.capitalize).value()')
        ).to.eql(['Foo', 'Bar']);
      });

      describe('"p"', () => {
        beforeEach(() => {
          sinon.spy(console, 'json');
        });

        afterEach(() => {
          console.json.restore();
        });

        it('should include console.json as "p"', () => {
          // console.json does not document its return value,
          // so don't test for it
          run.run(data, 'p(d)');
          sinon.assert.calledOnce(console.json);
          sinon.assert.calledWithExactly(console.json, data);
        });

        it('should return the first item passed to it', () => {
          expect(
            run.run(data, 'p(d,d)')
          ).to.eql(data);
        });
      });

      it('should not include other variables leaked into scope', () => {
        expect(
          _.bind(run.run, run, data, 'command')
        ).to.throw();
      });
    });
  });
});
