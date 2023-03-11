import degit = require('degit');
import { window } from 'vscode';
import { RegisterableCommand } from '../types';

function basicDegitCallback() {
  const repository = 'WissenIstNacht/widget-caller';

  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  emitter.clone('/Users/vali/Documents/hi/widget-caller1').then(
    () => {
      window.showInformationMessage(`${repository} successfully degitted.`);
    },
    (reason) => {
      window.showErrorMessage(`error degitting ${repository}.`);
      console.error('Reason ' + reason);
    }
  );
}

export const basicDegitCommand: RegisterableCommand = {
  name: 'degit-mock',
  callback: basicDegitCallback,
};
