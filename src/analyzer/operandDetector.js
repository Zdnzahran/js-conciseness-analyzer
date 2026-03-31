const { traverseAST } = require("../ast/astTraversal");

function detectOperands(ast) {

    const operands = Object.create(null);

    function addOperand(name) {

        if (name === undefined || name === null) return;

        const key = String(name);

        operands[key] = (operands[key] || 0) + 1;
    }

    traverseAST(ast, node => {

        switch (node.type) {

            case "Identifier":
                addOperand(node.name);
                break;

            case "Literal":
                addOperand(node.value);
                break;

            case "TemplateLiteral":
                addOperand("template");
                break;
        }

    });

    return operands;
}

module.exports = {
    detectOperands
};