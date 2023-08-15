import { RegisterableCommand } from '../types';
import { degitGhCommand } from './degitGh';
import { degitLocalCommand } from './degitLocal';

export const registerableCommands: RegisterableCommand[] = [
  degitGhCommand,
  degitLocalCommand,
];
