import degit = require('degit');
import {
  InputBoxOptions,
  OpenDialogOptions,
  Uri,
  commands,
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

async function openRepository(repositoryPath: string) {
  try {
    const config = workspace.getConfiguration('vsc-degit');
    const openPreference = config.get<
      'alwaysReuseWindow' | 'alwaysNewWindow' | 'alwaysPrompt' | 'never'
    >('preferredOpenAfterDegit');

    // undefined means "do nothing"
    type ActionOpen = 'openReuse' | 'openNew' | undefined;
    let action: ActionOpen = undefined;

    // assign action based on preferences/prompt
    if (openPreference === 'never') {
      return;
    } else if (openPreference === 'alwaysReuseWindow') {
      action = 'openReuse';
    } else if (openPreference === 'alwaysNewWindow') {
      action = 'openNew';
    } else {
      const promptMessage = 'Would you like to open the degitted repository?';
      const openReuse = 'Open';
      const openNew = 'Open in New Window';
      const choices = [openReuse, openNew];

      const promptValue = await window.showInformationMessage(
        promptMessage,
        { modal: true },
        ...choices
      );

      action =
        promptValue === openReuse
          ? 'openReuse'
          : promptValue === openNew
          ? 'openNew'
          : undefined;
    }

    const uri = Uri.file(repositoryPath);

    // execute action
    if (action === 'openReuse') {
      commands.executeCommand('vscode.openFolder', uri, {
        forceReuseWindow: true,
      });
    } else if (action === 'openNew') {
      commands.executeCommand('vscode.openFolder', uri, {
        forceNewWindow: true,
      });
    }
  } catch (err) {
    window.showErrorMessage(`Couldn't open the degitted repository.`);
  }
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
