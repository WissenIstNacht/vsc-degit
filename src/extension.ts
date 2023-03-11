import { commands, ExtensionContext } from 'vscode';
import { registerableCommands } from './commands';

export function activate(context: ExtensionContext) {
  registerableCommands.forEach((regCom) => {
    const newCommand = commands.registerCommand(
      'vsc-degit.' + regCom.name,
      regCom.callback
    );
    context.subscriptions.push(newCommand);
  });
}

export function deactivate() {}
