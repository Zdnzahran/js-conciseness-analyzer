const { traverseAST } = require("../ast/astTraversal");

function analyzeComplexity(ast) {

    let decisionPoints = 0;

    traverseAST(ast, node => {

        switch (node.type) {
            case "IfStatement":
            case "ForStatement":
            case "ForInStatement":  
            case "ForOfStatement":  
            case "WhileStatement":
            case "DoWhileStatement":
            case "CatchClause":
            case "ConditionalExpression":
                decisionPoints++;
                break;

            case "SwitchCase":
                //AGAR 'default:' TIDAK DIHITUNG
                if (node.test !== null) { 
                    decisionPoints++;
                }
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