var typescript = require("typescript");

var debugReverseMappings = Object.create(null);

function walkAst(node) {
    console.log(debugReverseMappings[node.kind]);
    typescript.forEachChild(node, walkAst);
}


module.exports = function(input, opts) {
    // Use typescript itself to extract the AST
    var sourceFile = typescript.createSourceFile("tmp.d.ts", input, typescript.ScriptTarget.ES6, true);
    Object.keys(typescript.SyntaxKind).forEach(function(k) {
        debugReverseMappings[typescript.SyntaxKind[k]] = k;
    });

    walkAst(sourceFile);

    return input;
}
