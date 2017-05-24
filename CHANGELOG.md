# Changelog

## [1.0.0](https://github.com/daxelrod/jowl/tree/v1.0.0) (2017-05-23)

Add passthrough mode: when no command is provided, Jowl acts as a JSON pretty-printer.

Update the provided [Lodash to version 4](https://github.com/lodash/lodash/wiki/Changelog#v400).
Unfortunately, this forced us to drop support for versions of Node older than 4.

Add support for Windows.

## [0.3.0](https://github.com/daxelrod/jowl/tree/v0.3.0) (2017-04-23)

Add new `p()` function for printing.

Add associated new `--quiet` mode to supress output not produced by `p()`.

## [0.2.0](https://github.com/daxelrod/jowl/tree/v0.2.0) (2015-12-28)

**Breaking Change: Remove Chain Mode.**

Remove the `-c` option and Chain Mode altogether. Instead of passing `-c`, begin your command
with `c.`.

Chain Mode did not save any typing, and made jowl harder to learn and explain.

## [0.1.0](https://github.com/daxelrod/jowl/tree/v0.1.0) (2015-12-28)

Initial release.

## [0.0.1](https://github.com/daxelrod/jowl/commit/84eb190b68a935f2f505998aee640e749d22e8a3) (2015-12-15)

First commit.
