var util = require("util");
var ts = require("typescript");
var helper = require("./lib/ast-helper");

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
function escape(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function walkAst(node) {
    if (!node.clobber) { return; }
    // console.log(node.kindStr + " => " + node.source() + "\n============================");

    // Remove all in-line comments
    var src = node.source();
    if (src.indexOf("//") !== -1) {
        node.clobber(
            src.split("\n").filter(function(x) {
                return !/^[\s]*\/\//.test(x); // look for start of line -> some whitespace maybe -> "//"
            }).join("\n")
        );
    }

    switch (node.kind) {
        case ts.SyntaxKind.ExportKeyword:
            if (node.parent && node.parent.kind === ts.SyntaxKind.FunctionDeclaration) {
                node.clobber(node.source().replace("export", "declare"));
            }
            break;
    }
}


module.exports = function(input, opts) {
    // Use typescript itself to extract the AST
    var sourceFile = ts.createSourceFile("tmp.d.ts", input, ts.ScriptTarget.ES6, true);
    return "// @flow\n" + helper(sourceFile.text, sourceFile, walkAst);
}

