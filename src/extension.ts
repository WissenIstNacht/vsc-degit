import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'vsc-degit.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from degit!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
