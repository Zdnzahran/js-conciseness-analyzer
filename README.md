# JS Conciseness Analyzer

**JS Conciseness Analyzer** is a Visual Studio Code extension designed to help developers measure internal software quality through code density analysis using **McCall Software Quality Factor**.

This tool performs static analysis on your JavaScript code to calculate code density based on the number of unique operators and operands.

## Key Features

* **Active File Analysis**: Instantly calculate Halstead metrics for the JavaScript file currently open in your editor.
* **Workspace Analysis (Bulk)**: Scan all files within a folder to get a broad overview of your project's quality.
* **Token Details**: View a comprehensive list of operators and operands detected by the parser.
* **Interactive Output Panel**: Analysis results are displayed in a clean, readable output panel directly inside VS Code.

## Metrics Measured

This extension calculates the following quality indicators:
1.  **Vocabulary ($n$)**    : The total number of unique operators and unique operands.
2.  **Length ($N$)**        : The total number of all operators and operands.
3.  **Estimated Length**    : The predicted length calculated via Halstead's formula.

## How to Use

1.  Open a JavaScript file (`.js`) in your editor.
2.  Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3.  Type and select the command: `JS Conciseness: Open Main Menu`.
4.  Choose your desired analysis mode:
    * **Analyze Active File**           : To analyze the currently open file.
    * **Analyze All Files in Folder**   : To analyze an entire directory.
    * **Show Token Details**            : To see the list of extracted tokens.
    * **About**                         : To see the detailed about this extension.

## Requirements

This extension utilizes the [Acorn](https://github.com/acornjs/acorn) library for Abstract Syntax Tree (AST) parsing. Ensure your JavaScript code is syntactically valid for accurate analysis.

## Project Information

* **Version**: 0.0.2
* **Publisher**: SahabatSapi
* **Categories**: Programming Languages, Linters, Static Analysis

## Contribution

Contributions are always welcome! If you find a bug or want to add new features (such as TypeScript support or additional metrics), please submit an *Issue* or *Pull Request* to this repository.

---
*Developed as part of a final project to measure internal software quality indicators.*