# Jowl - JSON Operations With Lodash

<!-- markdownlint-disable MD014 -->

```bash
$ jowl '{"messages" : _.map(d, "commit.author.date")}' < commits.json
```

<!-- markdownlint-enable MD014 -->

Jowl is a command-line filter for JSON expressions that uses plain JavaScript
with [Lodash](https://lodash.com/). It takes JSON on standard in, and writes
pretty-printed JSON to standard out.

Jowl's goals are:

* **Easy to learn**: Syntax you already know, as little magic as pratical
* **Concise**: intended to be used in one-liners, where keystrokes are at a premium
* **Convenient**: Do What I Mean shortcuts exist, but are not required for use

## Installation

### macOS or Linux via Homebrew

Install [Homebrew](https://brew.sh/). Then run:

```bash
brew install daxelrod/jowl/jowl
```

### macOS, Linux, or Windows via NPM

Jowl requires [NodeJS](https://nodejs.org/en/download/)(all LTS versions are supported) running on either Unix or Windows.

```bash
npm install --global --production jowl
```

## Reference

See the [complete reference](docs/reference.md).

## Comparison to similar programs

Several programs fulfill the same needs as Jowl. They are more mature and better
polished. However, there is still a sweet spot among them that Jowl hits.

### JQ

[JQ](https://stedolan.github.io/jq/) is an awesome program for querying and
transforming JSON that is better than Jowl in almost every way. Unfortunately, it
uses its own syntax that can be hard to remember unless used frequently. Jowl's
main benefit is that it uses familiar JavaScript syntax and Lodash functions.

### Underscore-CLI

[Underscore-CLI](https://github.com/ddopson/underscore-cli) also processes JSON with
JavaScript expressions and Underscore. It supports multiple kinds of operations, can
output to several formats, and can even handle CoffeeScript input. It's extremely
polished. Unfortunately, it either requires more typing than Jowl:
`underscore process "data[0]"` vs `jowl "d[0]"` or learning its shortcuts, which are
subcommands on the command line.

## Contributing

See the [guide to contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE)
