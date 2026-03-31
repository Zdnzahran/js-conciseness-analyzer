const { traverseAST } = require("../ast/astTraversal");

function detectOperators(ast) {

    const operators = Object.create(null);

    function addOperator(op) {

        if (!op) return;

        operators[op] = (operators[op] || 0) + 1;
    }

    traverseAST(ast, node => {

        switch (node.type) {

            case "BinaryExpression":
            case "LogicalExpression":
                addOperator(node.operator);
                break;

            case "AssignmentExpression":
                addOperator(node.operator);
                break;

            case "UpdateExpression":
                addOperator(node.operator);
                break;

            case "UnaryExpression":
                addOperator(node.operator);
                break;

            case "ConditionalExpression":
                addOperator("?:");
                break;

            case "IfStatement":
                addOperator("if");
                break;

            case "ForStatement":
                addOperator("for");
                break;

            case "WhileStatement":
                addOperator("while");
                break;

            case "DoWhileStatement":
                addOperator("do");
                break;

            case "SwitchCase":
                addOperator("case");
                break;

            case "ReturnStatement":
                addOperator("return");
                break;

            case "CatchClause":
                addOperator("catch");
                break;

            case "ArrowFunctionExpression":
                addOperator("=>");
                break;
            case "UnaryExpression":
                addOperator(node.operator);
            break;
case "NewExpression":
    addOperator("new");
    break;
        }

    });

    return operators;
}

module.exports = {
    detectOperators
};