const acorn = require("acorn");

function analyzeHalsteadTokens(code) {
    const options = {
        ecmaVersion: "latest",
        sourceType: "module", // Mode module lebih fleksibel untuk tokenizer
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
    };

    let tokenizer;
    try {
        tokenizer = acorn.tokenizer(code, options);
    } catch (e) {
        // Fallback jika inisialisasi awal gagal
        options.sourceType = "script";
        tokenizer = acorn.tokenizer(code, options);
    }

    const operators = Object.create(null);
    const operands = Object.create(null);

    const keywordsAsOperands = ["let", "const", "var", "function", "class", "true", "false", "null", "undefined"];
    const operandTypes = ["name", "string", "num", "regexp", "template"];
    
    const allowedOperators = [
        "=", "+=", "-=", "*=", "/=", "%=", "**=", "&&=", "||=", "??=",
        "+", "-", "*", "/", "%", "**",
        "<", ">", "<=", ">=", "==", "!=", "===", "!==",
        "&&", "||", "!", "&", "|", "^", "~", "<<", ">>", ">>>",
        "(", ")", "{", "}", "[", "]", ",", ".", "?", ":", "=>",
        "if", "else", "for", "while", "return", "switch", "case", "break", "continue", "default", "throw", "try", "catch", "finally",
        "typeof", "instanceof", "in", "delete", "void", "new", "await", "yield"
    ];

    try {
        while (true) {
            const token = tokenizer.getToken();
            if (token.type.label === "eof") break;

            const label = token.type.label;
            const keyword = token.type.keyword;
            const value = (token.value !== null && token.value !== undefined) ? String(token.value) : null;
            const identifier = keyword || label;

            if (operandTypes.includes(label) || keywordsAsOperands.includes(keyword)) {
                const operandName = keyword || value || label;
                operands[operandName] = (operands[operandName] || 0) + 1;
            } 
            else if (allowedOperators.includes(identifier)) {
                operators[identifier] = (operators[identifier] || 0) + 1;
            }
        }
    } catch (err) {
        console.error("Tokenizing error:", err.message);
    }

    return { operators, operands };
}

module.exports = { analyzeHalsteadTokens };