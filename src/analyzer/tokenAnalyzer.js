const acorn = require("acorn");

function analyzeHalsteadTokens(code) {
    // Gunakan sourceType: "script" agar lebih stabil membaca file CommonJS (.js)
    const options = {
        ecmaVersion: "latest",
        sourceType: "script", 
        allowReturnOutsideFunction: true
    };

    const tokenizer = acorn.tokenizer(code, options);
    const operators = Object.create(null);
    const operands = Object.create(null);

    // 1. DAFTAR OPERAN (Sesuai referensi Anda)
    const keywordsAsOperands = ["let", "const", "var", "function", "class", "true", "false", "null", "undefined"];
    const operandTypes = ["name", "string", "num", "regexp", "template"];

    // 2. DAFTAR OPERATOR (Referensi Anda + Keyword Operators)
    // Tanda titik koma (;), spread (...), dll telah DIHILANGKAN dari daftar ini.
    const allowedOperators = [
        // Assignment, Aritmetika, Relasional, Logika, Bitwise
        "=", "+=", "-=", "*=", "/=", "%=", "**=", "&&=", "||=", "??=",
        "+", "-", "*", "/", "%", "**",
        "<", ">", "<=", ">=", "==", "!=", "===", "!==",
        "&&", "||", "!", "&", "|", "^", "~", "<<", ">>", ">>>",
        // Simbol Lainnya & Kontrol Alur
        "(", ")", "{", "}", "[", "]", ",", ".", "?", ":", "=>",
        "if", "else", "for", "while", "return", "switch", "case", "break", "continue", "default", "throw", "try", "catch", "finally",
        // Keyword Operators (Satu-satunya yang dipertahankan dari saran sebelumnya)
        "typeof", "instanceof", "in", "delete", "void", "new", "await", "yield"
    ];

    while (true) {
        let token;
        try {
            token = tokenizer.getToken();
        } catch (e) {
            break; // Berhenti jika ada error parsing di tengah file
        }

        if (token.type.label === "eof") break;

        const label = token.type.label;
        const keyword = token.type.keyword;
        const value = (token.value !== null && token.value !== undefined) ? String(token.value) : null;

        const identifier = keyword || label;

        // LOGIKA PENYARINGAN:
        // Cek apakah masuk kategori Operan
        if (operandTypes.includes(label) || keywordsAsOperands.includes(keyword)) {
            const operandName = keyword || value || label;
            operands[operandName] = (operands[operandName] || 0) + 1;
        } 
        // Cek apakah masuk kategori Operator (Hanya jika ada di daftar allowedOperators)
        else if (allowedOperators.includes(identifier)) {
            operators[identifier] = (operators[identifier] || 0) + 1;
        }
        // Selain itu (seperti ';', '...', '?.', '??') akan OTOMATIS DIABAIKAN.
    }

    return { operators, operands };
}

module.exports = { analyzeHalsteadTokens };