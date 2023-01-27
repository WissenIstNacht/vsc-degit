import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'vsc-degit.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from degit!');
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand('vsc-degit.degit', () => {
    const options: vscode.InputBoxOptions = {
      ignoreFocusOut: true,
      placeHolder: 'URL',
      prompt: 'Enter a URL to degit',
      validateInput: (value: string) => {
        function isErroneousInput(value: string) {
          // TODO perform validation and return non-empty string on error.
          const UrlRegExp =
            /^((?:(?:http|ftp|ws)s?|sftp):\/\/?)?([^:/\s.#?]+\.[^:/\s#?]+|localhost)(:\d+)?((?:\/\w+)*\/)?([\w\-.]+[^#?\s]+)?([^#]+)?(#[\w-]*)?$/gm;
          const regExpResult = value.match(UrlRegExp);

          return regExpResult ? undefined : 'String must be a URL';
        }

        return isErroneousInput(value);
      },
    };
    vscode.window.showInputBox(options).then((value) => {
      if (value === undefined) {
        vscode.window.showInformationMessage('The prompt was cancelled');
      } else {
        vscode.window.showInformationMessage(`The entered URL was: ${value}`);
      }
    });
  });
}

export function deactivate() {}
