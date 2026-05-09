const acorn = require("acorn");

function analyzeHalsteadTokens(code) {
    const options = {
        ecmaVersion: "latest",
        sourceType: "module",
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
    };

    let tokenizer;
    try {
        tokenizer = acorn.tokenizer(code, options);
    } catch (e) {
        options.sourceType = "script";
        tokenizer = acorn.tokenizer(code, options);
    }

    const operators = Object.create(null);
    const operands = Object.create(null);

    // Literal murni operan
    const keywordsAsOperands = new Set(["true", "false", "null", "undefined"]);
    // Label acorn untuk  operan
    const operandTypes = new Set(["name", "string", "num", "regexp", "template"]);

    // List operator
    const allowedOperators = new Set([
        // Assignment
        "=", "+=", "-=", "*=", "/=", "%=", "**=", "&&=", "||=", "??=","++",
        // Arithmetic
        "+", "-", "*", "/", "%", "**",
        // Comparison
        "<", ">", "<=", ">=", "==", "!=", "===", "!==",
        // Logical & Bitwise
        "&&", "||", "!", "&", "|", "^", "~", "<<", ">>", ">>>", "??",
        // Punctuation / structural
        "(", ")", "{", "}", "[", "]", ",", ".", "?", ":", ";", "=>",
        // Keywords operator
        "if", "else", "for", "while", "return",
        "switch", "case", "break", "continue", "default",
        "throw", "try", "catch", "finally",
        "typeof", "instanceof", "in", "delete", "void",
        "new", "await", "yield",
        // Lain-lain yang sering dianggap operator dalam analisis kode
        "let", "const", "var", "function", "class", "async",  
    ]);

    // Keyword yang acorn keluarkan sebagai label "name" (bukan label keyword)
    // Perlu diidentifikasi via rawText, bukan token.type.keyword
    const keywordOperators = new Set([
        "let", "await", "yield", "async"
    ]);

    try {
        while (true) {
            const token = tokenizer.getToken();
            if (token.type.label === "eof") break;

            const label = token.type.label;
            const rawText = code.slice(token.start, token.end);

            // Cek keyword operan
            const kwValue = token.type.keyword || rawText;
            if (keywordsAsOperands.has(kwValue)) {
                const operandName = String(token.value ?? rawText);
                operands[operandName] = (operands[operandName] || 0) + 1;
                continue;
            }

            // Cek keyword yang acorn keluarkan sebagai label "name"
            if (label === "name" && keywordOperators.has(rawText)) {
                operators[rawText] = (operators[rawText] || 0) + 1;
                continue;
            }

            // Cek tipe operan biasa 
            if (operandTypes.has(label)) {
                const operandName = String(token.value ?? rawText);
                operands[operandName] = (operands[operandName] || 0) + 1;
                continue;
            }

            // Cek operator berdasarkan rawText
            // menangani semua operator termasuk yang labelnya ambigu di acorn
            if (allowedOperators.has(rawText)) {
                operators[rawText] = (operators[rawText] || 0) + 1;
            }
        }
    } catch (err) {
        console.error("Tokenizing error:", err.message);
    }

    return { operators, operands };
}

module.exports = { analyzeHalsteadTokens };