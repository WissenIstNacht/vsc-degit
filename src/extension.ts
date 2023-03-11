import degit = require('degit');
import { commands, ExtensionContext } from 'vscode';

import { basicDegitCommand } from './commands/basicDegit';
import { degitHelloWorldCommand } from './commands/degitHelloWorld';
import { urlInputCommand } from './commands/urlInput';

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    degitHelloWorldCommand.name,
    degitHelloWorldCommand.callback
  );
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
