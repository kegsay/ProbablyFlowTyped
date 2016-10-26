"use strict";
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var probsTyped = require("../index");

var defsDir = path.join(__dirname, "/defs");

var BOLD_ON = "\x1b[1m";
var BOLD_OFF = "\x1b[22m";
var RED = "\x1b[41m";
var FG_RED = "\x1b[31m";
var FG_GREEN = "\x1b[32m";
var RESET = "\x1b[0m";

var OKAY = BOLD_ON + FG_GREEN + "  OK" + RESET + "  ";
var FAIL = BOLD_ON + FG_RED + "FAIL" + RESET + "  ";

glob(defsDir + "/*.d.ts", function(err, files) {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }
    var exitCode = 0;
    var numFails = 0;
    files.forEach(function(f) {
        f = path.resolve(f); // convert \ to / so we can replace with out dir
        var outFile = f.replace(".d.ts", ".js.flow");
        var expectedOutput = fs.readFileSync(outFile, "utf8");
        var actualOutput = new String(probsTyped(fs.readFileSync(f, "utf8")));
        // console.log("EXPECT: " + expectedOutput);
        // console.log("ACTUAL: " + actualOutput);
        var actualOutLines = actualOutput.split("\n");
        var expectedOutLines = expectedOutput.split("\n");

        // strictly filter out lines that start "//" on both input and output - we don't care about comments!
        actualOutLines = actualOutLines.filter(function(line) {
            return line.trim().indexOf("//") !== 0;
        });
        expectedOutLines = expectedOutLines.filter(function(line) {
            return line.trim().indexOf("//") !== 0;
        });

        if (actualOutLines.length === expectedOutLines.length) {
            var isOkay = true;
            for (var lineNum = 0; lineNum < actualOutLines.length; lineNum++) {
                if (actualOutLines[lineNum] === expectedOutLines[lineNum]) {
                    continue;
                }
                isOkay = false;
                var lineLength = Math.max(actualOutLines[lineNum].length, expectedOutLines[lineNum].length);
                for (var charNum = 0; charNum < lineLength; charNum++) {
                    if (actualOutLines[lineNum][charNum] === expectedOutLines[lineNum][charNum]) {
                        continue;
                    }
                    var badChar = escape(actualOutLines[lineNum][charNum]);
                    var actualSnippet = snippet(actualOutLines[lineNum], charNum);
                    var expectedSnippet = snippet(expectedOutLines[lineNum], charNum);
                    
                    console.error(
                        "%s%s:%s:%s %s", FAIL, outFile, lineNum + 1, charNum + 1,
                        "Unexpected char: '" + badChar + "'. " +
                        "Got \"" + actualSnippet + "\", expected \"" + expectedSnippet + "\"."
                    );
                    numFails += 1;
                    break;
                }
            }
            if (isOkay) {
                console.log("%s%s", OKAY, outFile);
            }
        }
        else {
            console.error(
                "%s%s:%s %s", FAIL, outFile, 0,
                "Expected " + expectedOutLines.length + " lines, got " + actualOutLines.length
            );
            numFails += 1;
        }
    });
    console.log("%s test failures out of %s tests.", numFails, files.length);
    process.exit(numFails > 0 ? 1 : 0);
});

function snippet(line, charNum) {
    var leftMinSnip = Math.max(charNum - 15, 0);
    var leftMaxSnip = Math.max(charNum, 0);
    var rightMinSnip = Math.min(charNum + 1, line.length);
    var rightMaxSnip = Math.min(charNum + 15, line.length);
    return (
        escape(line.substring(leftMinSnip, leftMaxSnip)) +
        RED + escape(line[charNum]) + RESET +
        escape(line.substring(rightMinSnip, rightMaxSnip))
    );
}

function escape(thing) {
    if (thing === undefined) {
        return "<missing>";
    }
    var escapedThing = JSON.stringify(thing);
    return escapedThing.substring(1, escapedThing.length-1);
}

