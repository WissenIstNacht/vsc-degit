import { ExtensionContext } from 'vscode';

export type RegisterableCommand = {
  name: string;
  callback: (context: ExtensionContext) => void;
};

export type LocalPath = {
  path: string;
  frequency: number;
  lastPick: number;
  frecency: number;
};
