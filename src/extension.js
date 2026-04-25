const vscode = require('vscode');
const { analyzeHalsteadTokens } = require('./analyzer/tokenAnalyzer');
const { countLOC } = require('./metrics/locCounter');
const { calculateHalstead } = require('./metrics/halsteadCalculator');
const { parseAST } = require('./ast/astParser');
const { analyzeComplexity } = require('./analyzer/complexityAnalyzer');
const outputPanel = require('./ui/outputPanel');

function activate(context) {
    // Registrasi Perintah Utama: Open Main Menu
    let mainDisposable = vscode.commands.registerCommand('jsAnalyzer.openMainMenu', async () => {
        const options = [
            { 
                label: 'Analyze Active File', 
                detail: 'Menganalisis file JavaScript yang sedang aktif dalam editor.',
                action: analyzeActiveFile 
            },
            { 
                label: 'Show Halstead Token Details', 
                detail: 'Melihat rincian operator dan operan yang terdeteksi.',
                action: showTokenDetails 
            },
            { 
                label: 'Run Workspace Analysis', 
                detail: 'Menganalisis seluruh file JavaScript di dalam workspace/folder.',
                action: runBulkAnalysis 
            },
            { 
                label: 'About Tool', 
                detail: 'Informasi metodologi dan metrik.',
                action: () => outputPanel.showAbout() 
            }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Pilih perintah JS Conciseness Analyzer'
        });

        if (selected && selected.action) {
            selected.action();
        }
    });

    context.subscriptions.push(mainDisposable);
}

// --- FUNGSI PENDUKUNG (Logika dari Iterasi Sebelumnya) ---

function analyzeActiveFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Buka file JavaScript terlebih dahulu!');
        return;
    }
    const code = editor.document.getText();
    try {
        const loc = countLOC(code);
        const ast = parseAST(code);
        const complexity = analyzeComplexity(ast);
        const { operators, operands } = analyzeHalsteadTokens(code);
        const halstead = calculateHalstead(operators, operands);
        outputPanel.showSingleFileMetrics(editor.document.fileName, loc, complexity, halstead);
    } catch (err) {
        vscode.window.showErrorMessage('Gagal menganalisis: ' + err.message);
    }
}

function showTokenDetails() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    try {
        const { operators, operands } = analyzeHalsteadTokens(editor.document.getText());
        outputPanel.showHalsteadDetails(operators, operands);
    } catch (err) {
        vscode.window.showErrorMessage('Gagal membedah token: ' + err.message);
    }
}

async function runBulkAnalysis() {
    const files = await vscode.workspace.findFiles('**/*.js', '**/node_modules/**');
    if (files.length === 0) return;

    const results = [];
    const skippedFiles = [];

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Analyzing Project...",
        cancellable: false
    }, async (progress) => {
        for (const file of files) {
            try {
                const document = await vscode.workspace.openTextDocument(file);
                const code = document.getText();
                const loc = countLOC(code);
                if (loc < 20) {
                    skippedFiles.push({ file: vscode.workspace.asRelativePath(file), reason: "NCLOC < 20" });
                    continue;
                }
                const { operators, operands } = analyzeHalsteadTokens(code);
                const halstead = calculateHalstead(operators, operands);
                results.push({
                    file: vscode.workspace.asRelativePath(file),
                    loc: loc,
                    complexity: analyzeComplexity(parseAST(code)),
                    hlc: halstead.hlc,
                    halstead: halstead
                });
            } catch (e) {
                skippedFiles.push({ file: vscode.workspace.asRelativePath(file), reason: "Error" });
            }
        }
    });
    outputPanel.showBulkMetrics(results, skippedFiles);
}

module.exports = { activate, deactivate: () => {} };