const vscode = require('vscode');
const path = require('path');
const { parseAST } = require('./ast/astParser');
const { analyzeComplexity } = require('./analyzer/complexityAnalyzer');
const { analyzeHalsteadTokens } = require('./analyzer/tokenAnalyzer');
const { calculateHalstead } = require('./metrics/halsteadCalculator');
const { countLOC } = require('./metrics/locCounter');
const { showMetrics, showDetails, showAbout, showBulkMetrics } = require('./ui/outputPanel');

function activate(context) {
    // Fungsi pembantu untuk menjalankan analisis bulk
    async function performBulkAnalysis() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Silakan buka folder/workspace terlebih dahulu.");
            return;
        }

        const results = [];
        const ignoredFiles = [];
        const allFiles = await vscode.workspace.findFiles('**/*.js', '**/node_modules/**');

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Menganalisis Kualitas Kode di Workspace...",
            cancellable: false
        }, async (progress) => {
            for (let i = 0; i < allFiles.length; i++) {
                const fileUri = allFiles[i];
                const filePath = fileUri.fsPath;
                const fileName = path.relative(workspaceFolders[0].uri.fsPath, filePath);

                try {
                    const document = await vscode.workspace.openTextDocument(fileUri);
                    const code = document.getText();
                    const loc = countLOC(code);

                    if (loc < 20) {
                        ignoredFiles.push({ fileName, reason: `Baris kode terlalu sedikit (${loc} baris)` });
                        continue;
                    }

                    const ast = parseAST(code);
                    const { operators, operands } = analyzeHalsteadTokens(code);
                    const complexity = analyzeComplexity(ast);
                    const halstead = calculateHalstead(operators, operands);

                    results.push({ fileName, loc, complexity, halstead });
                } catch (err) {
                    ignoredFiles.push({ fileName, reason: `Error: ${err.message}` });
                }
                progress.report({ increment: (1 / allFiles.length) * 100 });
            }
        });

        // Urutkan berdasarkan skor HLC (kepadatan kode)
        results.sort((a, b) => a.halstead.hlc - b.halstead.hlc);
        showBulkMetrics(results, ignoredFiles);
    }

    // MENU UTAMA (Menyatukan semua perintah)
    let mainCommand = vscode.commands.registerCommand('jsAnalyzer.runAnalysis', async () => {
        const option = await vscode.window.showQuickPick([
            '1. Show Metrics (Active File)',
            '2. Show Halstead Details (Active File)',
            '3. Run Workspace Analysis (Bulk)',
            '4. About Tool'
        ]);

        if (!option) return;

        // Pilihan 3: Analisis Bulk
        if (option.startsWith('3')) {
            await performBulkAnalysis();
            return;
        }

        // Pilihan 4: About
        if (option.startsWith('4')) {
            showAbout();
            return;
        }

        // Pilihan 1 & 2: Analisis File Tunggal
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Tidak ada file yang sedang dibuka.");
            return;
        }

        const code = editor.document.getText();
        try {
            const ast = parseAST(code);
            const { operators, operands } = analyzeHalsteadTokens(code);
            const complexity = analyzeComplexity(ast);
            const loc = countLOC(code);
            const halstead = calculateHalstead(operators, operands);

            if (option.startsWith('1')) {
                showMetrics({ fileName: editor.document.fileName, loc, complexity, halstead });
            } else if (option.startsWith('2')) {
                showDetails({ operators, operands });
            }
        } catch (err) {
            vscode.window.showErrorMessage(`Gagal menganalisis file: ${err.message}`);
        }
    });

    // Tetap daftarkan perintah bulk secara terpisah agar bisa dipanggil via shortcut jika perlu
    let bulkCommand = vscode.commands.registerCommand('jsAnalyzer.runWorkspaceAnalysis', performBulkAnalysis);

    context.subscriptions.push(mainCommand, bulkCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };