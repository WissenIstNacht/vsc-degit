import degit = require('degit');
import { InputBoxOptions, Uri, window } from 'vscode';

import { GH_PROJECT_VALIDATION_REGEXP } from '../constants/regex';
import { RegisterableCommand } from '../types';
import { openRepository, pickFolder } from '../util/io';

async function degitGhCallback() {
  const repositoryId = await inputGhProject();
  if (repositoryId === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return;
  }
  const dstValue = await pickFolder('Degit Destination');
  degitHelper(repositoryId, dstValue);
}

async function degitHelper(repository: string, dst: Uri[]): Promise<void> {
  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  const degitPath = `${dst[0].path}/${repository}`;
  try {
    await emitter.clone(degitPath);
    openRepository(degitPath);
  } catch (reason) {
    window.showErrorMessage(`error degitting ${repository}.`);
    console.error('Reason ' + reason);
  }
}

async function inputGhProject(): Promise<string | undefined> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'Github Repository',
    prompt: 'Enter a Github repository to degit',
    validateInput: (inputBoxValue: string) => {
      function isErroneousInput(value: string) {
        const regExpResult = value.match(GH_PROJECT_VALIDATION_REGEXP);
        return regExpResult
          ? undefined
          : 'String must be a of type <Username>/<Projectname>';
      }

      return isErroneousInput(inputBoxValue);
    },
  };

  return window.showInputBox(options);
}

export const degitGhCommand: RegisterableCommand = {
  name: 'degit-gh',
  callback: degitGhCallback,
};
