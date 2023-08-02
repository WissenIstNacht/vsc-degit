import { execSync } from 'child_process';
import { window } from 'vscode';
import { RegisterableCommand } from '../types';
import { openRepository, pickFolder } from '../util/io';

async function degitLocalCallback() {
  const srcDirectory = await pickFolder('Degit Local Source');
  const dstDirectory = await pickFolder('Degit Local Destination');

  const srcPath = `${srcDirectory[0].path}`;
  const dstPath = `${dstDirectory[0].path}`;
  const repositoryName = srcPath.split('/').slice(-1)[0];

  try {
    execSync(
      `cd ${srcPath} && git clone ${dstPath} && cd ${repositoryName} && rm -rf .git`
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

export const degitLocalCommand: RegisterableCommand = {
  name: 'degit-local',
  callback: degitLocalCallback,
};
