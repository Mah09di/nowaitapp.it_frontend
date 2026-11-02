import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const statusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );

    statusBar.text = "$(rocket) MyCompany";
    statusBar.tooltip = "My Company";
    statusBar.show();

    context.subscriptions.push(statusBar);
}

export function deactivate() { }