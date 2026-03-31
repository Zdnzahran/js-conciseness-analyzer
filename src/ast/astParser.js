const acorn = require("acorn");

function parseAST(code) {
    return acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "script",
        allowReturnOutsideFunction: true
    });
}

module.exports = { parseAST };