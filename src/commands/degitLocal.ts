import { execSync } from 'child_process';
import {
  ExtensionContext,
  InputBoxOptions,
  QuickPickOptions,
  Uri,
  window,
} from 'vscode';

import { CLONE_NAME_VALIDATION_REGEXP } from '../constants/regex';
import { LocalPath, RegisterableCommand } from '../types';
import { openRepository, pickFolder } from '../util/io';

const LOCAL_REPO_HISTORY_KEY = 'local-repo-history';

async function degitLocalCallback(context: ExtensionContext) {
  let srcDirectory: Uri[], dstDirectory: Uri[];

  const localRepoHistory: LocalPath[] =
    context.globalState.get(LOCAL_REPO_HISTORY_KEY) || [];

  const quickPickResult = await quickPickPath(localRepoHistory);

  if (!quickPickResult) {
    window.showInformationMessage('The prompt was cancelled');
    return;
  } else if (quickPickResult === 'FOLDER_PICKER') {
    try {
      srcDirectory = await pickFolder('Degit Local Source');
    } catch (error) {
      return;
    }
  } else {
    srcDirectory = [Uri.file(quickPickResult.path)];
  }

  try {
    dstDirectory = await pickFolder('Degit Local Destination');
  } catch (error) {
    return;
  }

  const srcPath = `${srcDirectory[0].path}`;
  const dstPath = `${dstDirectory[0].path}`;
  let repositoryName = srcPath.split('/').slice(-1)[0];

  const name = await inputNewFolderName(repositoryName);
  if (name === undefined) {
    window.showInformationMessage('The prompt was cancelled');
    return;
  } else if (name) {
    repositoryName = name;
  }

  try {
    execSync(
      `git clone -l ${srcPath} ${dstPath}/${repositoryName} && cd ${dstPath}/${repositoryName} && rm -rf .git`
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

  const updatedLocalHistory = updateLocalRepoHistory(localRepoHistory, srcPath);
  context.globalState.update(LOCAL_REPO_HISTORY_KEY, updatedLocalHistory);
}

type QuickPickResult = { path: string } | 'FOLDER_PICKER';

async function quickPickPath(
  localRepoHistory: LocalPath[]
): Promise<QuickPickResult | undefined> {
  const maxCount = localRepoHistory.length > 4 ? 4 : localRepoHistory.length;
  const frecentPaths: string[] = [];
  for (let i = 0; i < maxCount; i++) {
    frecentPaths.push(localRepoHistory[i].path);
  }

  const options: QuickPickOptions = {
    canPickMany: false,
    matchOnDescription: true,
    placeHolder: 'Select a previously used path or open the folder picker',
    ignoreFocusOut: true,
  };

  const items = frecentPaths;
  const OPEN_FILE_PICKER = 'Open Folder Picker';
  items.push(OPEN_FILE_PICKER);
  return window.showQuickPick(items, options).then((quickPickValue) => {
    if (!quickPickValue) {
      return undefined;
    } else if (quickPickValue === OPEN_FILE_PICKER) {
      return 'FOLDER_PICKER';
    }
    return { path: quickPickValue };
  });
}

function updateLocalRepoHistory(
  localRepoHistory: LocalPath[],
  srcPath: string
) {
  let alreadyInHistory = false;
  localRepoHistory.forEach((lpRepo) => {
    if (lpRepo.path === srcPath) {
      lpRepo.frequency++;
      lpRepo.lastPick = 0;
      alreadyInHistory = true;
    } else {
      lpRepo.lastPick--;
    }
  });

  if (!alreadyInHistory) {
    const newRepo: LocalPath = {
      path: srcPath,
      frecency: 0,
      lastPick: 0,
      frequency: 1,
    };
    localRepoHistory.push(newRepo);
  }

  localRepoHistory.forEach(
    (lrh) => (lrh.frecency = computeFrecency(lrh.frequency, lrh.lastPick))
  );
  localRepoHistory.sort((a, b) => b.frecency - a.frecency);

  return localRepoHistory;
}

// recency expexts a non-positive number. This reflects the "lastPick" field of
// the local Path.
function computeFrecency(frequency: number, recency: number) {
  return frequency * Math.exp(recency);
}

async function inputNewFolderName(
  sourceName: string
): Promise<string | undefined> {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: sourceName,
    prompt:
      'Enter new destination folder name or confirm to reuse source folder name.',
    validateInput: (inputBoxValue: string) => {
      function isErroneousInput(value: string) {
        const regExpResult =
          value === '' || value.match(CLONE_NAME_VALIDATION_REGEXP);
        return regExpResult ? undefined : 'String must be a valid folder name';
      }

      return isErroneousInput(inputBoxValue);
    },
  };

  return window.showInputBox(options);
}

export const degitLocalCommand: RegisterableCommand = {
  name: 'degit-local',
  callback: degitLocalCallback,
};
