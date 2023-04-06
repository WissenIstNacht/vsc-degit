# Degit for VS Code

This extension allows to use NPM's degit from within VS Code.

## Intro

### Why?

Tired of navigating the terminal to use Degit? Do you want to degit a project using a simple key binding in VS Code? Then this extension is exactly right for you. With it, you can use Degit from the comfort of your favorite text editor.

### Degit?

Since you’ve found this extension, you probably know what Degit is. But just in case you stumbled upon it and haven’t had the pleasure yet: [Degit](https://github.com/Rich-Harris/degit) is a Node.js program developed by Rich Harris. It allows you to download Git repositories without the `.git` part. Sort of like cloning a Git project and then deleting the `.git` folder inside it.

Why is that useful? It's a great way to use Git repositories as templates. If you just clone the project, you get the history of the template itself, which you probably don’t want. The astute reader is may now be asking: "Why not use Github’s template functionality?". Good question! That's because it would assume you actually use Git with Github, which is not necessarily the case. But even if you do, you have to create a new Github repo to use the template, which is just as annoying.

## Features

### Degit from Github

Currently, the extension comes with one command: `Degit Github`. This command allows you to use Degit on a _public_ Github project. The command takes you through the following steps:

- Enter a Github project
- Specify a destination for the repository to be degitted to.
- Open the degitted repository in VS Code

## Bugs & Wishes

### Feature Requests

I plan to add more features (e.g., degit from gitlab or, more generally, any git URL) if I get the chance. If there’s something that would particularly help you, drop and issue on Github!

### Issues

I plan on making this a bug-free place. But hey, they're tricky to get rid of. If you find any, drop and issue on Github! :)

---

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
