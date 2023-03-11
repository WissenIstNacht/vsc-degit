import { commands, ExtensionContext } from 'vscode';

import { basicDegitCommand } from './commands/basicDegit';
import { degitHelloWorldCommand } from './commands/degitHelloWorld';
import { urlInputCommand } from './commands/urlInput';

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    'vsc-degit.' + degitHelloWorldCommand.name,
    degitHelloWorldCommand.callback
  );
  context.subscriptions.push(disposable);

  disposable = commands.registerCommand(
    'vsc-degit.' + urlInputCommand.name,
    urlInputCommand.callback
  );
  context.subscriptions.push(disposable);

  disposable = commands.registerCommand(
    'vsc-degit.' + basicDegitCommand.name,
    basicDegitCommand.callback
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
