import degit = require('degit');
import { commands, ExtensionContext } from 'vscode';

import { basicDegitCommand } from './commands/basicDegit';
import { degitHelloWorld } from './commands/degitHelloWorld';
import { urlInputCommand } from './commands/urlInput';

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    'vsc-degit.helloWorld',
    degitHelloWorld
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
