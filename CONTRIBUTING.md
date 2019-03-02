# Contributing

[![Linux Build Status](https://circleci.com/gh/daxelrod/jowl.svg?style=svg)](https://circleci.com/gh/daxelrod/jowl) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/daxelrod/jowl/branch/master)](https://ci.appveyor.com/project/daxelrod/jowl)

I'm glad you find Jowl useful enough that you want to help out! Thank you!

Please note that I get time to work on Jowl in fits and bursts, so issues and pull requests may sit for up to a month before I have a chance to initially respond to them.
Please don't be discouraged if it takes a little while.

## Issues

Please file an issue for any of the following reasons:

* You've encountered a bug
* You found behavior that surprised you (ease-of-use is an explicit Jowl design goal)
* You have an idea for new feature that would fit well into Jowl
* To tell me how you're using Jowl (understanding people's use-cases helps me to improve Jowl)
* [Just to say thanks](https://github.com/daxelrod/jowl/issues/4)

If applicable, please include your OS and version of Node.

## Pull Requests

I welcome pull requests for bugfixes or features!
Consider filing an issue for your feature before spending a lot of time on it to ensure it fits in with Jowl's design philosophy.

Contributions should be licensed [under the same license as Jowl](LICENSE).

Don't worry about modifying the changelog or incrementing the package version, I will do that upon release.

See [Developing Jowl](#developing-jowl) for detailed instructions.

## Developing Jowl

First, ensure the following dependencies are installed:

* [Git](https://git-scm.com/)
* [Node](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/en/docs/install) (to ensure that if you update dependencies in package.json, the yarnfile.lock is also updated)

Jowl supports [Node 4, 5, and 6](.circleci/config.yml).

1. [Fork](https://help.github.com/articles/fork-a-repo/) the Jowl repository and create a local clone of your fork.
1. Create a topic branch for the feature or bugfix you'd like to work on.
   ```bash
   git checkout master
   git checkout -b fix/terrible-bug
   ```
1. Install dependencies
   ```bash
   yarn
   ```
1. Run a build
   ```bash
   yarn run build
   ```

   This will run tests, linters, and style checkers for code and documentation.

   Note that build output may be a little difficult to read as [lines from different tests are interleaved](https://github.com/daxelrod/jowl/issues/1).
   Sorry about that.

   If the build doesn't pass, but [Linux](https://circleci.com/gh/daxelrod/jowl) and [Windows](https://ci.appveyor.com/project/daxelrod/jowl) Continuous Integration show the same commit passing, there's either something wrong with your development environment, or your platform is different than the ones Jowl is tested on.
   Feel free to file an issue (and link to the Continuous Integration build for the commit) and we'll get to the bottom of it.
1. Ensure your text editor is using LF (Unix) line endings.
1. [Write a test](#testing) for your new behavior and verify that it fails.
1. Modify the [source code](src/) or until the build passes again.

   Please conform to the [coding standards](#coding-standards), which are enforced at build time.
1. Commit your change. Please conform to the [commit standards](#commit-standards).
1. Repeat the previous three steps until your feature or bugfix is complete.
1. If you've added a feature, please write documentation for it in the [Reference](docs/reference.md) and add that as one last commit (alternatively, it's OK to add docs in the same commit where you change functionality).
1. Push your topic branch to your fork
   ```bash
   git push -u origin fix/terrible-bug
   ```
1. Use the GitHub interface to [Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/).
1. CircleCI and AppVeyor will begin building your changes and will report their status back to the Pull Request.

## Testing

Tests can be run with `yarn test`.

Every intended behavior in Jowl is tested either with a [unit test of the function implementing the behavior](test/unit)
or an [integration test of the entire program](test/integration).
Prefer unit tests, but if integration tests are useful for externally-facing behavior such as output or options parsing,
There is no need to write both unit and integration tests for the same behavior.

Each `it()` block should work in isolation without depending on other `it()` blocks having executed.

Jowl's tests use [Mocha](https://mochajs.org/) with [Chai `expect()` matchers](http://chaijs.com/api/bdd/).

## Standards

### Coding Standards

Jowl is written in ES6.

It is compatible with [Node 4, 5, and 6](.circleci/config.yml) on both Unix and Windows.

Source code conforms to the [Airbnb Style Guide](https://github.com/airbnb/javascript) with a few [exceptions](.eslintrc.js).
This is checked automatically at build time.

Markdown conforms to [Markdownlint rules](https://github.com/mivok/markdownlint/blob/master/docs/RULES.md) except for MD013 Line Length.
Please write one sentence per line instead, for more useful git diffs.
Rules are checked automatically at build time.

All text files use LF (Unix) line endings.
This is done because the Airbnb eslint style rules expect LF line endings on disk, and because [bin scripts should use LF when being published to NPM](https://github.com/npm/npm/issues/12371).
Git is configured convert other line endings to LF on commit so that they are represented as LF in the object database and to check out files as LF in the working directory.
A [`.editorconfig`](.editorconfig) is provided to automatically set line endings in many editors.

### Commit Standards

```text
feat(run): add chain runner

Add command runner which works in chain mode. This library will
be used by the executable, which will handle command line
processing and JSON parsing and serialization.

In chain mode, the command is prefixed with a Lodash chain with
the data as the context. After the command, .value() is
automatically called.
```

Please follow [The Seven Rules of a Great Commit Message](https://chris.beams.io/posts/git-commit/#seven-rules) except for #3 (please don't capitalize the first word).

Commit also messages conform to the [Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit)
except that the `scope` in the parentheses should be one of the following:

* **General**
  * `run`
  * `cli`
  * `lint`
  * `format`
* **`docs` type only**
  * `readme`
  * `reference`
  * `help` (text output by running `jowl --help`)
* **`chore` type only**
  * `ci` (continuous integration configuration)
  * `gulp`
  * `release`
  * `deps`
* **`test` type only**
  * `integration`

Note that unlike Angular, the changelogs are not generated automatically from commit messages.
I do not believe a one-to-one correspondance between commit messages and changelog lines is useful.
Further, the audience for commit messages is other developers, while the audience for changelogs is users.
