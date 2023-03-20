import { InputBoxOptions, window } from 'vscode';
import { RegisterableCommand } from '../types';

function urlInputCallback() {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'URL',
    prompt: 'Enter a URL to degit',
    validateInput: (value: string) => {
      function isErroneousInput(value: string) {
        const regExpResult = value.match(URL_VALIDATION_REGEXP);
        return regExpResult ? undefined : 'String must be a URL';
      }

      return isErroneousInput(value);
    },
  };
  window.showInputBox(options).then((value) => {
    if (value === undefined) {
      window.showInformationMessage('The prompt was cancelled');
    } else {
      window.showInformationMessage(`The entered URL was: ${value}`);
    }
  });
}

export const urlInputCommand: RegisterableCommand = {
  name: 'degit',
  callback: urlInputCallback,
};
