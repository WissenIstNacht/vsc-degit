import { execSync } from 'child_process';
import { InputBoxOptions, window } from 'vscode';
import { CLONE_NAME_VALIDATION_REGEXP } from '../constants/regex';
import { RegisterableCommand } from '../types';
import { openRepository, pickFolder } from '../util/io';

async function degitLocalCallback() {
  degitLocal(false);
}

async function degitLocalNamedCallback() {
  degitLocal(true);
}

async function degitLocal(named: boolean) {
  const srcDirectory = await pickFolder('Degit Local Source');
  const dstDirectory = await pickFolder('Degit Local Destination');

  const srcPath = `${srcDirectory[0].path}`;
  const dstPath = `${dstDirectory[0].path}`;
  let repositoryName = srcPath.split('/').slice(-1)[0];

  if (named) {
    const name = await inputRepositoryName();
    if (name === undefined) {
      window.showInformationMessage('The prompt was cancelled');
      return;
    }
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

async function inputRepositoryName(): Promise<string | undefined> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'Github Repository',
    prompt: 'Enter a Github repository to degit',
    validateInput: (inputBoxValue: string) => {
      function isErroneousInput(value: string) {
        // TODO change validation
        const regExpResult = value.match(CLONE_NAME_VALIDATION_REGEXP);
        return regExpResult
          ? undefined
          : 'String must be a of type <Username>/<Projectname>';
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

export const degitLocalNamedCommand: RegisterableCommand = {
  name: 'degit-local-named',
  callback: degitLocalNamedCallback,
};
