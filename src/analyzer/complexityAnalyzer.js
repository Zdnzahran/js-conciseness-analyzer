const { traverseAST } = require("../ast/astTraversal");

function analyzeComplexity(ast) {

    let decisionPoints = 0;

    traverseAST(ast, node => {

        switch (node.type) {

            case "IfStatement":
            case "ForStatement":
            case "WhileStatement":
            case "DoWhileStatement":
            case "CatchClause":
                decisionPoints++;
                break;

            case "SwitchCase":
                decisionPoints++;
                break;

            case "ConditionalExpression":
                decisionPoints++;
                break;

            case "LogicalExpression":

                if (node.operator === "&&" || node.operator === "||") {
                    decisionPoints++;
                }

                break;

        }

    });

    return 1 + decisionPoints;
}

module.exports = {
    analyzeComplexity
};