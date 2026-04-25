const acorn = require("acorn");

function parseAST(code) {
    const options = {
        ecmaVersion: "latest",
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true,
        locations: true // Mengaktifkan pelacakan baris/kolom pada AST
    };

    try {
        // Coba parsing sebagai ES Module (untuk file yang pakai import/export)
        return acorn.parse(code, { ...options, sourceType: "module" });
    } catch (err) {
        // Jika gagal, coba sebagai script biasa (untuk file CommonJS)
        try {
            return acorn.parse(code, { ...options, sourceType: "script" });
        } catch (scriptErr) {
            // Menangkap informasi lokasi error dari Acorn (jika ada)
            const line = scriptErr.loc ? scriptErr.loc.line : '?';
            const column = scriptErr.loc ? scriptErr.loc.column : '?';
            
            // Membersihkan pesan asli dari Acorn yang kadang mencantumkan angka posisi ganda
            const cleanMessage = scriptErr.message.replace(/\s*\(\d+:\d+\)$/, '');

            throw new Error(`Kesalahan sintaks di Baris ${line}, Kolom ${column}. Detail: ${cleanMessage}`);
        }
    }
}

module.exports = { parseAST };