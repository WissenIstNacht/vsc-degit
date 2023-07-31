import { OpenDialogOptions, Uri, window, workspace } from 'vscode';

export async function pickFolder(title: string): Promise<Uri[]> {
  const config = workspace.getConfiguration('vsc-degit');
  const path = config.get('preferredFilePickerLocation') as string | undefined;
  const options: OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    title,
    openLabel: 'Select',
    defaultUri: path ? Uri.file(path) : undefined,
  };

  const dstValue = await window.showOpenDialog(options);
  if (dstValue === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return Promise.reject();
  } else {
    return Promise.resolve(dstValue);
  }
}
