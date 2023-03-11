import { InputBoxOptions, window } from 'vscode';

export function urlInputCommand() {
  const options: InputBoxOptions = {
    ignoreFocusOut: true,
    placeHolder: 'URL',
    prompt: 'Enter a URL to degit',
    validateInput: (value: string) => {
      function isErroneousInput(value: string) {
        // TODO perform validation and return non-empty string on error.
        const UrlRegExp =
          /^((?:(?:http|ftp|ws)s?|sftp):\/\/?)?([^:/\s.#?]+\.[^:/\s#?]+|localhost)(:\d+)?((?:\/\w+)*\/)?([\w\-.]+[^#?\s]+)?([^#]+)?(#[\w-]*)?$/gm;
        const regExpResult = value.match(UrlRegExp);

        return regExpResult ? undefined : 'String must be a URL';
      }

      return isErroneousInput(value);
    },
  };
  window.showInputBox(options).then((value) => {
    if (value === undefined) {
      window.showInformationMessage('The prompt was cancelled');
    } else {
      window.showInformationMessage(`The entered URL was: ${value}`);
    }
  });
}
