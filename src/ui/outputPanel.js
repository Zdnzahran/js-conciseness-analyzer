const vscode = require('vscode');

const outputChannel = vscode.window.createOutputChannel("JS Conciseness Analyzer");

function showSingleFileMetrics(fileName, loc, complexity, halstead) {
    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("==================================================");
    outputChannel.appendLine("        JS CONCISENESS ANALYZER - REPORT          ");
    outputChannel.appendLine("==================================================");
    outputChannel.appendLine(`File: ${fileName}`);
    outputChannel.appendLine("");
    outputChannel.appendLine("1. METRIK DASAR");
    outputChannel.appendLine(`- NCLOC                 : ${loc}`);
    outputChannel.appendLine(`- Cyclomatic Complexity : ${complexity}`);
    outputChannel.appendLine("");
    outputChannel.appendLine("2. PARAMETER HALSTEAD");
    outputChannel.appendLine(`- Unique Operators (n1) : ${halstead.n1}`);
    outputChannel.appendLine(`- Unique Operands (n2)  : ${halstead.n2}`);
    outputChannel.appendLine(`- Total Operators (N1)  : ${halstead.N1}`);
    outputChannel.appendLine(`- Total Operands (N2)   : ${halstead.N2}`);
    outputChannel.appendLine("");
    outputChannel.appendLine("3. HASIL PERHITUNGAN");
    outputChannel.appendLine(`- Vocabulary (n)        : ${halstead.vocabulary}`);
    outputChannel.appendLine(`- Length (N)            : ${halstead.length}`);
    
    // Membatasi Estimated Length jadi 2 desimal agar rapi
    outputChannel.appendLine(`- Estimated Length (^N) : ${Number(halstead.estimatedLength).toFixed(2)}`);
    
    // Membatasi HLC menjadi 4 angka di belakang koma
    outputChannel.appendLine(`- CONCISENESS SCORE     : ${Number(halstead.hlc).toFixed(4)}`);
    outputChannel.appendLine("==================================================");
}

function showHalsteadDetails(operators, operands) {
    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("==================================================");
    outputChannel.appendLine("      DETIL PARAMETER HALSTEAD TERDETEKSI         ");
    outputChannel.appendLine("==================================================");
    
    outputChannel.appendLine("\n[ DAFTAR OPERATOR (n1) ]");
    outputChannel.appendLine("--------------------------------------------------");
    Object.entries(operators).forEach(([op, count]) => {
        outputChannel.appendLine(`${op.padEnd(20)} : ${count} kali`);
    });

    outputChannel.appendLine("\n[ DAFTAR OPERAN (n2) ]");
    outputChannel.appendLine("--------------------------------------------------");
    Object.entries(operands).forEach(([opd, count]) => {
        outputChannel.appendLine(`${opd.padEnd(20)} : ${count} kali`);
    });
    outputChannel.appendLine("==================================================");
}

function showBulkMetrics(results, skippedFiles) {
    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("=========================================================================================");
    outputChannel.appendLine("                        JS CONCISENESS ANALYZER - WORKSPACE REPORT                       ");
    outputChannel.appendLine("=========================================================================================");
    outputChannel.appendLine(`Waktu Analisis      : ${new Date().toLocaleString()}`);
    outputChannel.appendLine(`Total File Diproses : ${results.length} valid | ${skippedFiles.length} diabaikan (Filter)`);
    outputChannel.appendLine("-----------------------------------------------------------------------------------------");

    if (results.length > 0) {
        results.sort((a, b) => a.hlc - b.hlc);

        outputChannel.appendLine(
            "FILE NAME".padEnd(50) + " | " + 
            "NCLOC".padEnd(8) + " | " + 
            "COMPLEXITY".padEnd(10) + " | " + 
            "SCORE"
        );
        outputChannel.appendLine("-".repeat(89));

        results.forEach(r => {
            let displayFile = r.file.length > 48 ? "..." + r.file.substring(r.file.length - 45) : r.file;
            outputChannel.appendLine(
                displayFile.padEnd(50) + " | " + 
                r.loc.toString().padEnd(8) + " | " + 
                r.complexity.toString().padEnd(10) + " | " + 
                // Menerapkan toFixed(4) pada skor HLC di tabel
                Number(r.hlc).toFixed(4)
            );
        });

        outputChannel.appendLine("");
        outputChannel.appendLine("-----------------------------------------------------------------------------------------");
        outputChannel.appendLine("DETAIL PARAMETER HALSTEAD (Sorted by Lowest Conciseness Score)");
        outputChannel.appendLine("-----------------------------------------------------------------------------------------");
        
        results.forEach(res => {
            const h = res.halstead || { n1: "-", n2: "-", N1: "-", N2: "-" };
            outputChannel.appendLine(`> ${res.file}`);
            outputChannel.appendLine(`  [Tokens: n1=${h.n1}, n2=${h.n2} | Total: N1=${h.N1}, N2=${h.N2}]`);
            outputChannel.appendLine("");
        });
    }

    if (skippedFiles.length > 0) {
        outputChannel.appendLine("=========================================================================================");
        outputChannel.appendLine(" EXCLUDED / SKIPPED FILES (NCLOC < 20 atau Error)");
        outputChannel.appendLine("=========================================================================================");
        skippedFiles.forEach(s => {
            outputChannel.appendLine(`- ${s.file} (Alasan: ${s.reason})`);
        });
    }
    outputChannel.appendLine("=========================================================================================\n");
}

function showAbout() {
    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("        TENTANG JS CONCISENESS ANALYZER (METODE HITUNG)        ");
    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("");
    outputChannel.appendLine("Alat ini mengukur kualitas internal kode melalui tingkat");
    outputChannel.appendLine("kepadatan kode (conciseness) berdasarkan model McCall.");
    outputChannel.appendLine("");
    outputChannel.appendLine("TAHAPAN PENGHITUNGAN CONCISENESS:");
    outputChannel.appendLine("---------------------");
    outputChannel.appendLine("1. Identifikasi Token (Operator & Operan):");
    outputChannel.appendLine("   Sistem membedah kode menjadi Operator dan Operan");
    outputChannel.appendLine("   yang ditentukan (Dilampirkan pada bagian bawah).");
    outputChannel.appendLine("");
    outputChannel.appendLine("2. Hasil Identifikasi Token:");
    outputChannel.appendLine("   Hasil identifikasi berupa jumlah operan dan operator unik (n1, n2)");
    outputChannel.appendLine("   dan jumlah total kemunculan operator dan operan (N1, N2).");
    outputChannel.appendLine("");
    outputChannel.appendLine("3. Menghitung Panjang Aktual (N):");
    outputChannel.appendLine("   Total seluruh token yang Anda tulis di dalam file, yaitu N = N1 + N2.");
    outputChannel.appendLine("");
    outputChannel.appendLine("4. Menghitung Panjang Estimasi (Estimated Length):");
    outputChannel.appendLine("   Prediksi panjang ideal menurut Teori Halstead ");
    outputChannel.appendLine("   yaitu Estimated Length = (n1 * log2(n1)) + (n2 * log2(n2)).");
    outputChannel.appendLine("");
    outputChannel.appendLine("5. Menghitung Skor Kepadatan (Conciseness Score):");
    outputChannel.appendLine("   Conciseness Score diukur dari seberapa dekat panjang nyata (N) dengan");
    outputChannel.appendLine("   Estimated Length. Rumus: 1 - (|Estimasi - Aktual| / Aktual).");
    outputChannel.appendLine("   Apabila (|Estimasi - Aktual| / Aktual) lebih dari 1, maka skor dianggap 0");
    outputChannel.appendLine("   atau tidak ringkas sama sekali.");
    outputChannel.appendLine("");
    outputChannel.appendLine("INTERPRETASI SKOR:");
    outputChannel.appendLine("------------------");
    outputChannel.appendLine("- Skor Mendekati 1.0: Kode Sangat Ringkas & Efisien.");
    outputChannel.appendLine("- Skor Rendah (< 0.5): Kode Kurang Ringkas (terjadi redundansi atau");
    outputChannel.appendLine("  penggunaan kosakata yang tidak proporsional).");
    outputChannel.appendLine("");
    outputChannel.appendLine("");
    outputChannel.appendLine("TAHAPAN PENGHITUNGAN NCLOC & CC");
    outputChannel.appendLine("---------------------");
    outputChannel.appendLine("1. Non-Comment Lines of Code (NCLOC):");
    outputChannel.appendLine("   Sistem membedah kode dan akan menghitung jumlah baris kode aktif");
    outputChannel.appendLine("   dengan cara menghapus baris kosong dan komentar.");
    outputChannel.appendLine("");
    outputChannel.appendLine("2. Cyclomatic Complexity (CC):");
    outputChannel.appendLine("   Sistem menghitung kompleksitas siklomatis dari kode");
    outputChannel.appendLine("  dengan menganalisis struktur kontrol (seperti if, for, while)");
    outputChannel.appendLine("  lalu menghitung jumlah jalur eksekusi yang mungkin terjadi.");
    outputChannel.appendLine("");
    outputChannel.appendLine("KRITERIA TOKEN TERDETEKSI (HALSTEAD):");
    outputChannel.appendLine("------------------");
    outputChannel.appendLine("1. Operator (n1):");
    outputChannel.appendLine("   - Deklarasi & Fungsi       : let, const, var, function, class.");
    outputChannel.appendLine("   - Aritmatika & Assignment  : +, -, *, /, %, =, +=, -=, dst.");
    outputChannel.appendLine("   - Perbandingan & Logika    : ==, ===, !=, !==, <, >, &&, ||, !.");
    outputChannel.appendLine("   - Kontrol Alur             : if, else, for, while, switch, case, return, try, catch.");
    outputChannel.appendLine("   - Simbol & Tanda Baca      : ( ), { }, [ ], ,, ., :, ;.");
    outputChannel.appendLine("");
    outputChannel.appendLine("2. Operan (n2):");
    outputChannel.appendLine("   - Identitas                : Nama variabel, nama fungsi, dan properti (label: name).");
    outputChannel.appendLine("   - Literal Data             : String, angka (num), RegExp, dan template literal.");
    outputChannel.appendLine("   - Keyword Literal          : true, false, null, undefined.");
    outputChannel.appendLine("===============================================================");
}

module.exports = {
    showSingleFileMetrics,
    showHalsteadDetails,
    showBulkMetrics,
    showAbout
};