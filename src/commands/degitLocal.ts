import { execSync } from 'child_process';
import { InputBoxOptions, window } from 'vscode';
import { CLONE_NAME_VALIDATION_REGEXP } from '../constants/regex';
import { RegisterableCommand } from '../types';
import { openRepository, pickFolder } from '../util/io';

async function degitLocalCallback() {
  degitLocal();
}

async function degitLocal() {
  const srcDirectory = await pickFolder('Degit Local Source');
  const dstDirectory = await pickFolder('Degit Local Destination');

  const srcPath = `${srcDirectory[0].path}`;
  const dstPath = `${dstDirectory[0].path}`;
  let repositoryName = srcPath.split('/').slice(-1)[0];

  const name = await inputNewFolderName(repositoryName);
  if (name === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return;
  } else if (name) {
    repositoryName = name;
  }

  try {
    execSync(
      `git clone -l ${srcPath} ${dstPath}/${repositoryName} && cd ${dstPath}/${repositoryName} && rm -rf .git`
    );
  } catch (error) {
    if ((error as Error).message.match('already exists')) {
      window.showErrorMessage(
        'Could not degit because degitted folder already exists in destination directory'
      );
    }
    return;
  }

  const newRepository = `${dstPath}/${repositoryName}`;
  openRepository(newRepository);
}

async function inputNewFolderName(
  sourceName: string
): Promise<string | undefined> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: sourceName,
    prompt:
      'Enter new destination folder name or confirm to reuse source folder name.',
    validateInput: (inputBoxValue: string) => {
      function isErroneousInput(value: string) {
        const regExpResult =
          value === '' || value.match(CLONE_NAME_VALIDATION_REGEXP);
        return regExpResult ? undefined : 'String must be a valid folder name';
      }

      return isErroneousInput(inputBoxValue);
    },
  };

  return window.showInputBox(options);
}

export const degitLocalCommand: RegisterableCommand = {
  name: 'degit-local',
  callback: degitLocalCallback,
};
