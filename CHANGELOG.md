# Changelog

## [2.3.1](https://github.com/daxelrod/jowl/tree/v2.3.1) (2023-08-21)

Contains no changes to any of the source code in the package from 2.0.1.

Fix a bug in the automation that prevented 2.3.0 from being published to Fedora.

## [2.3.0](https://github.com/daxelrod/jowl/tree/v2.3.0) (2023-08-05)

Add support for Node version 20, which will become LTS.

Fedora's next version will use node 20.

## [2.2.0](https://github.com/daxelrod/jowl/tree/v2.2.0) (2022-09-21)

Add support for packaging in Fedora.

Make Jowl more convenient to install by packaging it for Fedora.
Packaging for more platforms is on its way.

## [2.1.0](https://github.com/daxelrod/jowl/tree/v2.1.0) (2022-09-18)

Add support for Node version 18, which will become LTS.
This paves the way for adding Jowl to Fedora, whose next version will use
node 18.

## [2.0.2](https://github.com/daxelrod/jowl/tree/v2.0.2) (2022-02-22)

Contains no changes to any of the source code in the package from 2.0.1.

Fix a bug in the automation that prevented 2.0.1 from being published to npmjs.org.

## [2.0.1](https://github.com/daxelrod/jowl/tree/v2.0.1) (2022-02-22)

(This release was never published to npmjs.org nor the Homebrew daxelrod/jowl tap due to a CI bug.)

Improve color contrast on a variety of common terminals' built in color schemes.

Jowl intentionally uses colors from the 16 color palette, which names colors like "green" but does not assign them specific values in color space, which means they are mapped by the terminal's color scheme to specific RGB values.
Unfortunately, in the built-in color schemes across many popular terminals, many colors do not have sufficient contrast against the background color in the color scheme to be legible.

After [testing against all built-in color schemes](https://github.com/daxelrod/jowl/issues/39) across widely used terminals on all OSes we support, make a couple of tweaks to maximize legibility.

As a reminder, the color codes that are output are not considered a stable interface.
If this change has broken one of your workflows, please use the `--no-color` flag in that workflow.

## [2.0.0](https://github.com/daxelrod/jowl/tree/v2.0.0) (2022-01-15)

### Syntax Highlighting

Add colors for syntax highlighting! It's been a long road to get here, but now, when outputting to a TTY that supports color, Jowl's output is syntax-highlighted.
This makes it both a more useful pretty-printer and makes output easier to understand in general.

The colors are intended to be readable on a wide variety of terminal color schemes.
If you use an even mildly common color scheme and you find the output hard to read, please file an issue with a screenshot.
Future releases will tweak the colors after testing across more terminals.

When output is not to a TTY (for example, a pipe), it does not contain ANSI color codes and continues to be valid JSON, and the behavior can be customized via [command line switches](https://github.com/daxelrod/jowl/blob/master/docs/reference.md#color) or [environment variables](https://github.com/daxelrod/jowl/blob/master/docs/reference.md#force-color).

Since this means some Jowl output is no longer valid JSON (because of the added ANSI codes), this is a **Breaking Change**.
That said, it is not expected to break most use cases in practice.
Note that the precise color codes output are not considered a stable interface and may change from release to release without that being considered a breaking change.

### Node Compatability

Adopt a new policy for compatability where current LTS versions of Node are officially supported and tested, and end-of-life LTS versions are supported on a best-effort basis.

The Node ecosystem moves fast.
Supporting end-of-life Node versions requires pinning Jowl's dependencies to old versions, and these versions tend not to get security updates.
Jowl's release cadence has also been such that it's not worth adding and quickly dropping support for non-LTS versions of Node.

For Jowl major version 2, that means that support for Node 4 and Node 5 have been dropped, which is a **Breaking Change**, and the following node versions are now supported:

* 6 (left in to have some overlap with supported Node versions from Jowl 1.0, but in practice a huge pain to support)
* 8
* 10
* 12
* 14
* 16

Be advised that Jowl major version 3 will likely only support maintained Node LTS versions, and that if vulnerabilities are discovered in Jowl 2's dependencies, the only remediation may be to upgrade to Jowl 3 because no available version of the dependencies will likely exist that runs on the older Nodes that Jowl 2 supports.

### Other Changes

* **Breaking Change** Indent output JSON to 2 spaces instead of 4.

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
