# Jowl Reference

    jowl [options] [command]

Jowl takes JSON on standard in, and writes the JSON-strigified value of `command` to standard out.

The only current option is [`--quiet`](#quiet) (or `-q` for short) which disables writing of `command`'s value to standard out.

*All examples use Bourne shell syntax.*

## Command

```bash
$ echo 'true' | jowl '{"name": "jowl", "awesome": d}'
{
  "name": "jowl",
  "awesome": "true"
}
```

`command` is evaluated as a JavaScript expression, and its value is converted to JSON and outputted.

It is run in something close to `var value = eval('(' + command + ') )` to ensure that curly
braces are interepreted as object constructors rather than blocks.

If `command` is not supplied, Jowl simply acts as a pretty-printer.

## Input and Output

**Standard In** is expected to be a string representing a single JSON object. (This may eventually be
expanded to a stream of multiple JSON objects.) Processing does not start until input ends. The parsed
JSON will be available as the `d` variable.

The value of `command` will have `.value()` called on it if it is a Lodash chain. The results of this
will be run through JSON.stringify, optionally syntax highlighted, and output to **Standard Out** (except in [quiet mode](#quiet)).

Syntax highlighting will be automatically applied when **Standard Out** is a color-supporting TTY by adding ANSI color codes.
ANSI color codes are not added if not outputting to a TTY.
The specific colors used are subject to change in future versions without this being considered a breaking change.
See the [`--color` & `--no-color` options](#color) or the [`FORCE_COLOR` environment variable](#force-color).

## Variables

```bash
$ echo '[{"name":"jowl"}, {"name":"jq"}, {"name":"underscore"}]' | jowl '{"all": c.map("name").value(), "newest": _.capitalize(d[0].name)}'
{
  "all": [
    "jowl",
    "jq",
    "underscore"
  ],
  "newest": "Jowl"
}
```

The following variables are available within `command`'s execution environment:

Variable | Value
---------|------
`_` | [Lodash](https://lodash.com/docs)
`d` | Parsed input **data**
`c` | **[Chain](https://lodash.com/docs#chain)**. Shortcut for `_.chain(d)`
`p()` | **[Print](#print-function)**. Pretty-prints its argument

### Print Function

```bash
$ echo '[1,2,3]' | jowl -q 'c.each(p)'
1
2
3
```

`p()` prints its first argument to standard out. This is useful for creating non-JSON output, or when it makes more sense to write your command imperatively rather than
a transformation to a different data structure.

It is often used with the [`--quiet`](#quiet) option so that the results of the command are not written to standard out
in addition to `p()`'s output.

`p()` is actually a call to [`console.json`](https://www.npmjs.com/package/console.json), which prints a single string
or number verbatim, but pretty-prints more complex data structures as JSON.

Its return value is the argument that was passed in, for maximum utility when chaining.

## Options

### Quiet

`--quiet` or `-q`

Disables the  writing the the value of `command` to standard out.
The output of the [Print Function`p()`](#print) is still written.

### Color

`--color` or instead `--no-color`

By default, Jowl will use various heuristics to decide whether to output ANSI color codes to syntax-highlight the value of `command`.

These mutually-exclusive options override the heuristics to force always writing ANSI color codes (`--color`) or never writing them (`--no-color`).

Specifying both options will result in undefined behavior and will likely be disallowed later.

See also the [`FORCE_COLOR` environment variable](#force-color) environment variable as another mechanism to control this behavior.

## Environment Variables

### Force Color

`FORCE_COLOR`

By default, Jowl will use various heuristics to decide whether to output ANSI color codes to syntax-highlight the value of `command`.

This environment variable overrides both these heuristics and the [`--color` or `--no-color` options](#color).

When set to `1`, forces always writing ANSI color codes.

When set to `0`, forces never writing ANSI color codes.
