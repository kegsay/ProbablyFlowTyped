// help modify the AST by adding a clobber() function to Nodes
var typescript = require("typescript");

var reverseKinds = Object.create(null);
Object.keys(typescript.SyntaxKind).forEach(function(k) {
    reverseKinds[typescript.SyntaxKind[k]] = k;
});

function insertHelpers(node, chunks) {
    if (node.pos == null || node.end == null) { return; }
    if (node.source) { throw new Error("source property already exists"); }
    
    // debugging
    if (node.kind) {
        node.kindStr = reverseKinds[node.kind];
    }

    // The source of the node is between the two parsed AST indexes
    node.source = function() {
        return chunks.slice(node.pos, node.end).join("");
    };
    
    // Replace a node's text. Blanks out the elements corresponding to this chunk and replaces it
    // with the new text (it's fine that the new text is a string and not a char)
    node.clobber = function(newText) {
        chunks[node.pos] = newText;
        for (var i = node.pos + 1; i < node.end; i++) {
            chunks[i] = "";
        }
    };
}

module.exports = function(rawSource, programNode, fn) {
    var chunks = rawSource.split(""); // string -> array

    // Decorate each node with a source() and clobber() function
    function walk(node) {
        insertHelpers(node, chunks);
        typescript.forEachChild(node, walk);
        fn(node);
    }

    walk(programNode);

    return chunks.join("");
};

