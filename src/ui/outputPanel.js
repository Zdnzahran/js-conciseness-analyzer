const vscode = require("vscode");

let outputChannel = vscode.window.createOutputChannel("JS Analyzer");

function showMetrics(data) {

    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("JavaScript Conciseness Analysis");
    outputChannel.appendLine("--------------------------------");

    outputChannel.appendLine(`File: ${data.fileName}`);
    outputChannel.appendLine("");

    outputChannel.appendLine(`NCLOC: ${data.loc}`);
    outputChannel.appendLine(`Cyclomatic Complexity: ${data.complexity}`);
    outputChannel.appendLine("");

    outputChannel.appendLine("Halstead Metrics");
    outputChannel.appendLine("----------------");

    outputChannel.appendLine(`n1 (unique operators): ${data.halstead.n1}`);
    outputChannel.appendLine(`n2 (unique operands): ${data.halstead.n2}`);

    outputChannel.appendLine(`N1 (total operators): ${data.halstead.N1}`);
    outputChannel.appendLine(`N2 (total operands): ${data.halstead.N2}`);

    outputChannel.appendLine("");

    outputChannel.appendLine(`Vocabulary (n): ${data.halstead.vocabulary}`);
    outputChannel.appendLine(`Length (N): ${data.halstead.length}`);

    outputChannel.appendLine(`Estimated Length: ${data.halstead.estimatedLength.toFixed(2)}`);

    outputChannel.appendLine(`HLC: ${data.halstead.hlc.toFixed(3)}`);
}

function showDetails(data) {

    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("Halstead Details");
    outputChannel.appendLine("----------------");

    outputChannel.appendLine("");
    outputChannel.appendLine("Operators:");

    for (let op in data.operators) {
        outputChannel.appendLine(`${op} : ${data.operators[op]}`);
    }

    outputChannel.appendLine("");
    outputChannel.appendLine("Operands:");

    for (let operand in data.operands) {
        outputChannel.appendLine(`${operand} : ${data.operands[operand]}`);
    }

}

function showAbout() {

    vscode.window.showInformationMessage(
        "JavaScript Conciseness Analyzer - Measures code conciseness using Halstead Structural Consistency based on McCall Quality Model."
    );

}


function showBulkMetrics(results, ignored) {
    outputChannel.clear();
    outputChannel.show(true);
    
    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("        WORKSPACE CONCISENESS ANALYSIS REPORT           ");
    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("");
    
    // Header Tabel Ringkasan
    outputChannel.appendLine(`${"FILE NAME".padEnd(40)} | ${"HLC".padEnd(8)} | ${"CC".padEnd(5)} | ${"LOC"}`);
    outputChannel.appendLine("-".repeat(70));

    results.forEach(res => {
        const hlcScore = res.halstead.hlc.toFixed(3);
        const name = res.fileName.length > 37 ? "..." + res.fileName.slice(-37) : res.fileName;
        
        outputChannel.appendLine(
            `${name.padEnd(40)} | ${hlcScore.padEnd(8)} | ${String(res.complexity).padEnd(5)} | ${res.loc}`
        );
    });

    outputChannel.appendLine("");
    outputChannel.appendLine("---------------------------------------------------------------");
    outputChannel.appendLine("DETAIL METRIK HALSTEAD (Sorted by Lowest HLC)");
    outputChannel.appendLine("---------------------------------------------------------------");
    
    // Menampilkan n1, n2, N1, N2 secara horizontal agar hemat ruang
    results.forEach(res => {
        const h = res.halstead;
        outputChannel.appendLine(`> ${res.fileName}`);
        outputChannel.appendLine(`  [Tokens: n1=${h.n1}, n2=${h.n2} | Total: N1=${h.N1}, N2=${h.N2}]`);
        outputChannel.appendLine("");
    });

    // Poin 1: File non-JS atau yang dilewati diletakkan di paling bawah
    if (ignored.length > 0) {
        outputChannel.appendLine("");
        outputChannel.appendLine("===============================================================");
        outputChannel.appendLine("EXCLUDED / SKIPPED FILES");
        outputChannel.appendLine("===============================================================");
        ignored.forEach(f => {
            outputChannel.appendLine(`- ${f.fileName.padEnd(40)} : ${f.reason}`);
        });
    }

    outputChannel.appendLine("");
    outputChannel.appendLine("Analysis Complete.");
}

function showAbout() {
    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("        TENTANG JS CONCISENESS ANALYZER (METODE HITUNG)        ");
    outputChannel.appendLine("===============================================================");
    outputChannel.appendLine("");
    outputChannel.appendLine("Alat ini mengukur kualitas internal kode melalui tingkat");
    outputChannel.appendLine("keringkasan (conciseness) berdasarkan model McCall.");
    outputChannel.appendLine("");
    outputChannel.appendLine("TAHAPAN PENGHITUNGAN:");
    outputChannel.appendLine("---------------------");
    outputChannel.appendLine("1. Identifikasi Token (Operator & Operan):");
    outputChannel.appendLine("   Sistem membedah kode menjadi Operator (simbol, keyword) dan");
    outputChannel.appendLine("   Operan (nama variabel, nilai literal).");
    outputChannel.appendLine("");
    outputChannel.appendLine("2. Menghitung Panjang Aktual (N):");
    outputChannel.appendLine("   Total seluruh token yang Anda tulis di dalam file.");
    outputChannel.appendLine("");
    outputChannel.appendLine("3. Menghitung Panjang Estimasi (Estimated Length):");
    outputChannel.appendLine("   Prediksi panjang ideal menurut Teori Halstead berdasarkan");
    outputChannel.appendLine("   variasi unik operator (n1) dan operan (n2) yang digunakan.");
    outputChannel.appendLine("");
    outputChannel.appendLine("4. Menghitung Skor HLC (Halstead Length Concistency):");
    outputChannel.appendLine("   HLC diukur dari seberapa dekat panjang nyata (N) dengan");
    outputChannel.appendLine("   prediksi teoretisnya. Rumus: 1 - (|Estimasi - Aktual| / Aktual).");
    outputChannel.appendLine("");
    outputChannel.appendLine("INTERPRETASI SKOR:");
    outputChannel.appendLine("------------------");
    outputChannel.appendLine("- Skor Mendekati 1.0: Kode Sangat Ringkas & Efisien.");
    outputChannel.appendLine("- Skor Rendah (< 0.5): Kode Kurang Ringkas (terjadi redundansi atau");
    outputChannel.appendLine("  penggunaan kosakata yang tidak proporsional).");
    outputChannel.appendLine("");
    outputChannel.appendLine("===============================================================");
}

module.exports = {
    showMetrics,
    showDetails,
    showAbout,
    showBulkMetrics
};