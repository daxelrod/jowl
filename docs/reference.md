# Jowl Reference

    jowl  <command>`

Jowl takes JSON on standard in, and writes the JSON-strigified value of `command` to standard out.

## Command

```
$ echo 'true' | jowl '{"name": "jowl", "awesome": d}'
{
    "name": "jowl",
    "awesome": "true"
}
```

`command` is evaluated as a JavaScript expression, and its value is converted to JSON and outputted.

It is run in something close to `var value = eval('(' + command + ') )` to ensure that curly
braces are interepreted as object constructors rather than blocks.

## Variables

```
$ echo '[{"name":"jowl"}, {"name":"jq"}, {"name":"underscore"}]' | jowl '{"all": c.pluck("name").value(), "newest": _.capitalize(d[0].name)}'
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
_ | [Lodash](https://lodash.com/docs)
d | Parsed input **data**
c | **[Chain](https://lodash.com/docs#chain)**. Shortcut for `_.chain(d)`

## Input and Output

**Standard In** is expected to be a string representing a single JSON object. (This may eventually be
expanded to a stream of multiple JSON objects.) Processing does not start until input ends. The parsed
JSON will be available as the `d` variable.

The value of `command` will have `.value()` called on it if it is a Lodash chain. The results of this
will be run through JSON.stringify and output to **Standard Out**.

