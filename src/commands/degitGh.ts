import degit = require('degit');
import { InputBoxOptions, OpenDialogOptions, Uri, window } from 'vscode';

import { RegisterableCommand } from '../types';

function degitGhCallback() {
  inputGhProject().then((inputValue) => {
    inputDstFolder().then((dst) => {
      degitHelper(inputValue, dst);
    });
  });
}

function degitHelper(repository: string, dst: Uri[]) {
  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  emitter.clone(`${dst[0].path}/${repository}`).then(
    () => {
      window.showInformationMessage(`${repository} successfully degitted.`);
    },
    (reason) => {
      window.showErrorMessage(`error degitting ${repository}.`);
      console.error('Reason ' + reason);
    }
  );
}

async function inputDstFolder(): Promise<Uri[]> {
  const options: OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    title: 'Degit Destination',
    openLabel: 'Select',
  };
  return window.showOpenDialog(options).then((value) => {
    if (value === undefined) {
      window.showInformationMessage('The prompt was cancelled');
      return Promise.reject();
    } else {
      return Promise.resolve(value);
    }
  });
}

async function inputGhProject(): Promise<string> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'Github Repository',
    prompt: 'Enter a Github repository to degit',
    // FIXME Validation doesn't react properly
    // validateInput: (inputBoxValue: string) => {
    //   function isErroneousInput(value: string) {
    //     const regExpResult = value.match(GH_PROJECT_VALIDATION_REGEXP);
    //     return regExpResult
    //       ? undefined
    //       : 'String must be a of tye <Username>/<Projectname>';
    //   }

    //   return isErroneousInput(inputBoxValue);
    // },
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
