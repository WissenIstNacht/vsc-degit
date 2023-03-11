import { window } from 'vscode';
import { RegisterableCommand } from '../types';

function helloWorldCallback() {
  window.showInformationMessage('Hello World from degit!');
}

export const degitHelloWorldCommand: RegisterableCommand = {
  name: 'helloWorld',
  callback: helloWorldCallback,
};
