# vsc-degit: Degit extension for VS Code

## Features

TODO

## Development

### Run the extension in VS Code

Launch debug environment (default `F5`) to open a new window with the extension loaded. The opened window can be relaoded to include the latest updates to the code.

### Run tests

- Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
- Press `F5` to run the tests in a new window with your extension loaded.
- See the output of the test result in the debug console.
- Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  - The provided test runner will only consider files matching the name pattern `**.test.ts`.
  - You can create folders inside the `test` folder to structure your tests any way you want.
