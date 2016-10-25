var util = require("util");
var typescript = require("typescript");
var helper = require("./lib/ast-helper");

var debugReverseMappings = Object.create(null);

function walkAst(node) {
    console.log(debugReverseMappings[node.kind]);
    // console.log(util.inspect(node));
            console.log("======");
}


module.exports = function(input, opts) {
    // Use typescript itself to extract the AST
    var sourceFile = typescript.createSourceFile("tmp.d.ts", input, typescript.ScriptTarget.ES6, true);
    Object.keys(typescript.SyntaxKind).forEach(function(k) {
        debugReverseMappings[typescript.SyntaxKind[k]] = k;
    });
    return helper(input, sourceFile, walkAst);
}
