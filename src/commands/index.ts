import { RegisterableCommand } from '../types';
import { basicDegitCommand } from './basicDegit';
import { degitHelloWorldCommand } from './degitHelloWorld';
import { urlInputCommand } from './urlInput';

export const registerableCommands: RegisterableCommand[] = [
  basicDegitCommand,
  urlInputCommand,
  degitHelloWorldCommand,
];
