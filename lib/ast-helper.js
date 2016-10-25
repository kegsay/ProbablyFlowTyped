// help modify the AST by adding an update() function to Nodes
var typescript = require("typescript");

function insertHelpers(node, chunks) {
    if (!node.pos || !node.end) { return; }
    if (node.source) { throw new Error("source property already exists"); }
    
    // The source of the node is between the two parsed AST indexes
    node.source = function() {
        return chunks.slice(node.pos, node.end).join("");
    };
    
    // Updating a node blanks out the elements corresponding to this chunk and replaced
    // with the new text (it's fine that the new text is a string and not a char)
    node.update = function(newText) {
        chunks[node.pos] = newText;
        for (var i = node.pos + 1; i < node.end; i++) {
            chunks[i] = "";
        }
    };
}

module.exports = function(rawSource, programNode, fn) {
    var chunks = rawSource.split(""); // string -> array

    // Decorate each node with a source() and update() function
    function walk(node) {
        insertHelpers(node, chunks);
        typescript.forEachChild(node, walk);
        fn(node);
    }

    walk(programNode);

    return chunks.join("");
};

