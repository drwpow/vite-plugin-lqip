# Contributing

Thanks for being willing to contribute! 🙏

**Working on your first Pull Request (PR)?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github)

## Open issues

Please check out the [the open issues](https://github.com/drwpow/vite-plugin-lqip/issues). Issues labelled [**Good First Issue**](https://github.com/drwpow/vite-plugin-lqip/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)are especially good to start with.

Contributing doesn’t have to be in code! Simply answering questions in open issues, or providing workarounds, is just as important a contribution as making pull requests.

## Opening a Pull Request

Pull requests are **welcome** for this repo! PRs are especially welcome for:

- Bugfixes
- Image compression improvements
- Image quality improvements
- Performance improvements

### Setup

1. Install [pnpm](https://pnpm.io/)
2. [Fork this repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone your copy locally
3. Run `pnpm i` to install dependencies

### Writing code

Create a new branch for your PR with `git checkout -b your-branch-name`. Add the relevant code as well as docs and tests. When you push everything up (`git push`), navigate back to your repo GitHub and you should see a prompt to open a new PR.

While best practices for commit messages are encouraged (e.g. start with an imperative verb, keep it short, use the body if needed), this repo doesn’t follow any specific guidelines. Clarity is favored over strict rules. Changelogs are generated separately from git (see [the Changelogs section](#changelogs))

### Writing the PR

**Please fill out the template!** It’s a very lightweight template 🙂.

### Opening a PR

When opening a pull request, make sure all of the following is done:

- [x] Tests are added
- [x] Build passes (`npm run build`)
- [x] Tests pass (`npm test`)
- [x] Linting passes (`npm run lint`)

Lastly, be sure to fill out the complete PR template!

### Changelogs

The changelog is generated via [changesets](https://github.com/changesets/changesets), and is separate from Git commit messages and pull request titles. To write a human-readable changelog for your changes, run:

```
npx changeset
```

This will ask if it’s a `patch`, `minor`, or `major` change ([semver](https://semver.org/)), along with a plain description of what you did. Commit this new file along with the rest of your PR, and during the next release this will go into the official changelog!

## Testing

This library uses [Vitest](https://vitest.dev/) for testing. There’s a great [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer) you can optionally use if you’d like in-editor debugging tools.

### Running tests

To run the entire test suite once, run:

```bash
pnpm test
```

To run an individual test:

```bash
pnpm test -- [partial filename]
```

To start the entire test suite in watch mode:

```bash
npx vitest
```

### Running linting

To run ESLint on the project:

```bash
npm run lint
```
