# Jowl Reference

    jowl [options] <command>`

Jowl takes JSON on standard in, and writes the JSON-strigified value of `command` to standard out.

The only current option is `--chain` (or `-c` for short) which turns on Chain Mode.

## Execution Modes

### Value Mode

```
$ echo 'true' | jowl '{"name": "jowl", "awesome": d}'
{
    "name": "jowl",
    "awesome": "true"
}
```

This is the default mode for Jowl. `command` is evaluated as a JavaScript expression, and its
value is converted to JSON and outputted.

It is run in something close to `var value = eval('(' + command + ') )` to ensure that curly
braces are interepreted as object constructors rather than blocks.

### Chain Mode

```
 $ echo '["a","b","c"]' | node src/bin/index.js -c "get(0).capitalize()"
"A"
```

Pass the `-c` flag for Chain Mode. `command` is evaluated as JavaScript within a Lodash [chain](https://lodash.com/docs#chain)
wrapping the data from standard in, and its value is converted to JSON and outputted.

It is run in something close to `var value = eval('_.chain(d).' + command 'value()')`.

## Variables

```
$ echo '[{"name":"jowl"}, {"name":"jq"}, {"name":"underscore"}]' | node src/bin/index.js '{"all": c.pluck("name").value(), "newest": _.capitalize(d[0].name)}'
{
    "all": [
        "jowl",
        "jq",
        "underscore"
    ],
    "newest": "Jowl"
}
```

Regardless of execution modes, the following variables are available within `command`'s execution environment:

Variable | Value
---------|------
_ | Lodash
d | Parsed input **data**
c | **Chain**. Shortcut for `_.chain(d)`

## Input and Output

**Standard In** is expected to be a string representing a single JSON object. (This may eventually be
expanded to a stream of multiple JSON objects.) Processing does not start until input ends.

The value of `command` will have `.value()` called on it if it is a Lodash chain (regardless of whether
Jowl is in Chain Mode). The results of this will be run through JSON.stringify and output to
**Standard Out**.

