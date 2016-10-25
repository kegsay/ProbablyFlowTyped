#!/usr/bin/env node
"use strict";

var fs = require("fs");
var nopt = require("nopt");
var path = require("path");
var probablyTyped = require("./index");

var opts = nopt({
    "typescript": path,
    "output": path,
    "help": Boolean,
}, {
    "t": "--typescript",
    "o": "--output",
    "h": "--help",
});

if (opts.typescript) {
    var out = probablyTyped(fs.readFileSync(opts.typescript, "utf8"));
    if (opts.output) {
        fs.writeFileSync(opts.output, out);
    }
    else {
        console.log(out);
    }
}
else {
    console.log("Converts Typescript declaration files into Flow library definitions");
    console.log("Usage:");
    console.log("  probably-flow-typed -t FILEPATH [-o FILEPATH]");
    console.log("Options:");
    console.log(" -t, --typescript FILEPATH    Required. The .d.ts file to convert.");
    console.log(" -o, --output FILEPATH        The file to output the Flow library definition to. If missing, output goes to stdout.");
    console.log(" -h, --help                   Show this help.");
    process.exit(0);
}
