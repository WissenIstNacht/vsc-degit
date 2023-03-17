import degit = require('degit');
import { InputBoxOptions, window } from 'vscode';
import { RegisterableCommand } from '../types';

function degitGhCallback() {
  userInput().then((inputValue) => {
    degitHelper(inputValue);
  });
}

function degitHelper(repository: string) {
  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  emitter.clone(`/Users/vali/Documents/hi/${repository}`).then(
    () => {
      window.showInformationMessage(`${repository} successfully degitted.`);
    },
    (reason) => {
      window.showErrorMessage(`error degitting ${repository}.`);
      console.error('Reason ' + reason);
    }
  );
  window.showInformationMessage(`${repository} successfully degitted.`);
}

async function userInput(): Promise<string> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'Github Repository',
    prompt: 'Enter a Github repository to degit',
    validateInput: (value: string) => {
      function isErroneousInput(value: string) {
        // TODO perform validation and return non-empty string on error.
        const UrlRegExp =
          /^[a-zA-Z]+[a-zA-Z\d\-_]*\/[a-zA-Z]+[a-zA-Z\d\-_]*$/gm;
        const regExpResult = value.match(UrlRegExp);

        return regExpResult
          ? undefined
          : 'String must be a of tye <Username>/<Projectname>';
      }

      return isErroneousInput(value);
    },
  };

  return window.showInputBox(options).then((value) => {
    if (value === undefined) {
      window.showInformationMessage('The prompt was cancelled');
      return Promise.reject();
    } else {
      return Promise.resolve(value);
    }
  });
}

export const degitGhCommand: RegisterableCommand = {
  name: 'degit-gh',
  callback: degitGhCallback,
};
