import { OpenDialogOptions, Uri, commands, window, workspace } from 'vscode';

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

export async function openRepository(repositoryPath: string) {
  try {
    const config = workspace.getConfiguration('vsc-degit');
    const openPreference = config.get<
      'alwaysReuseWindow' | 'alwaysNewWindow' | 'alwaysPrompt' | 'never'
    >('preferredOpenAfterDegit');

    // undefined means "do nothing"
    type ActionOpen = 'openReuse' | 'openNew' | undefined;
    let action: ActionOpen = undefined;

    // assign action based on preferences/prompt
    if (openPreference === 'never') {
      return;
    } else if (openPreference === 'alwaysReuseWindow') {
      action = 'openReuse';
    } else if (openPreference === 'alwaysNewWindow') {
      action = 'openNew';
    } else {
      const promptMessage = 'Would you like to open the degitted repository?';
      const openReuse = 'Open';
      const openNew = 'Open in New Window';
      const choices = [openReuse, openNew];

      const promptValue = await window.showInformationMessage(
        promptMessage,
        { modal: true },
        ...choices
      );

      action =
        promptValue === openReuse
          ? 'openReuse'
          : promptValue === openNew
          ? 'openNew'
          : undefined;
    }

    const uri = Uri.file(repositoryPath);

    // execute action
    if (action === 'openReuse') {
      commands.executeCommand('vscode.openFolder', uri, {
        forceReuseWindow: true,
      });
    } else if (action === 'openNew') {
      commands.executeCommand('vscode.openFolder', uri, {
        forceNewWindow: true,
      });
    }
  } catch (err) {
    window.showErrorMessage(`Couldn't open the degitted repository.`);
  }
}
