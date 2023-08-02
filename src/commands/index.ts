import { RegisterableCommand } from '../types';
import { degitGhCommand } from './degitGh';
import { degitLocalCommand, degitLocalNamedCommand } from './degitLocal';

export const registerableCommands: RegisterableCommand[] = [
  degitGhCommand,
  degitLocalCommand,
  degitLocalNamedCommand,
];
