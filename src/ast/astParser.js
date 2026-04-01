const acorn = require("acorn");

function parseAST(code) {
    const options = {
        ecmaVersion: "latest",
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true // Sangat penting untuk file JS modern
    };

    try {
        // Coba parsing sebagai ES Module (untuk file yang pakai import/export)
        return acorn.parse(code, { ...options, sourceType: "module" });
    } catch (err) {
        // Jika gagal, coba sebagai script biasa (untuk file CommonJS)
        try {
            return acorn.parse(code, { ...options, sourceType: "script" });
        } catch (scriptErr) {
            // Jika keduanya gagal, baru lempar error asli
            throw new Error(`Gagal parsing AST: ${scriptErr.message}`);
        }
    }
}

module.exports = { parseAST };