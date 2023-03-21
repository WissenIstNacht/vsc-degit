import degit = require('degit');
import {
  InputBoxOptions,
  OpenDialogOptions,
  Uri,
  window,
  workspace,
} from 'vscode';

import { GH_PROJECT_VALIDATION_REGEXP } from '../constants/regex';
import { RegisterableCommand } from '../types';

async function degitGhCallback() {
  const inputValue = await inputGhProject();
  const dstValue = await inputDstFolder();
  degitHelper(inputValue, dstValue);
}

async function degitHelper(repository: string, dst: Uri[]) {
  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  try {
    await emitter.clone(`${dst[0].path}/${repository}`);
    window.showInformationMessage(`${repository} successfully degitted.`);
  } catch (reason) {
    window.showErrorMessage(`error degitting ${repository}.`);
    console.error('Reason ' + reason);
  }
}

async function inputDstFolder(): Promise<Uri[]> {
  const config = workspace.getConfiguration('vsc-degit');
  const path = config.get('preferredFilePickerLocation') as string | undefined;
  const options: OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    title: 'Degit Destination',
    openLabel: 'Select',
    defaultUri: path ? Uri.file(path) : undefined,
  };

  const dstValue = await window.showOpenDialog(options);
  if (dstValue === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return Promise.reject();
  } else {
    return Promise.resolve(dstValue);
  }
}

async function inputGhProject(): Promise<string> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'Github Repository',
    prompt: 'Enter a Github repository to degit',
    validateInput: (inputBoxValue: string) => {
      function isErroneousInput(value: string) {
        const regExpResult = value.match(GH_PROJECT_VALIDATION_REGEXP);
        return regExpResult
          ? undefined
          : 'String must be a of tye <Username>/<Projectname>';
      }

      return isErroneousInput(inputBoxValue);
    },
  };

  const inputValue = await window.showInputBox(options);
  if (inputValue === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return Promise.reject();
  } else {
    return Promise.resolve(inputValue);
  }
}

export const degitGhCommand: RegisterableCommand = {
  name: 'degit-gh',
  callback: degitGhCallback,
};
