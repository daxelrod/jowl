'use strict';

var expect = require('chai').expect;
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
          runner.run(data, 'get("0.words").map(_.capitalize)')
        ).to.eql(['Foo', 'Bar']);
      });
    });
  });
});
