import degit = require('degit');
import { window } from 'vscode';

import { RegisterableCommand } from '../types';

async function basicDegitCallback() {
  const repository = WIDGET_CALLER;

  const emitter = degit(repository);
  emitter.on('info', (info) => {
    console.log(info.message);
  });
  emitter.on('warn', (info) => {
    console.warn(info.message);
  });

  try {
    await emitter.clone(`${LOCAL_DST}/widget-caller`);
    window.showInformationMessage(`${repository} successfully degitted.`);
  } catch (reason) {
    window.showErrorMessage(`error degitting ${repository}.`);
    console.error('Reason ' + reason);
  }
}

export const basicDegitCommand: RegisterableCommand = {
  name: 'degit-basic',
  callback: basicDegitCallback,
};
