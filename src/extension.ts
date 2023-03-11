import degit = require('degit');
import { commands, ExtensionContext, window } from 'vscode';

import { basicDegitCommand } from './commands/basicDegit';
import { urlInputCommand } from './commands/urlInput';

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand('vsc-degit.helloWorld', () => {
    window.showInformationMessage('Hello World from degit!');
  });
  context.subscriptions.push(disposable);

  disposable = commands.registerCommand('vsc-degit.degit', urlInputCommand);
  context.subscriptions.push(disposable);

  disposable = commands.registerCommand(
    'vsc-degit.degit-mock',
    basicDegitCommand
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
