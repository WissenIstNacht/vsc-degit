import { InputBoxOptions, window } from 'vscode';

import { URL_VALIDATION_REGEXP } from '../constants/regex';
import { RegisterableCommand } from '../types';

async function urlInputCallback() {
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

  const inputValue = await window.showInputBox(options);
  if (inputValue === undefined) {
    window.showInformationMessage('The prompt was cancelled');
  } else {
    window.showInformationMessage(`The entered URL was: ${inputValue}`);
  }
}

export const urlInputCommand: RegisterableCommand = {
  name: 'url-input',
  callback: urlInputCallback,
};
