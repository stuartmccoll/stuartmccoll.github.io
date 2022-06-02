# README.md

This repository contains both the source and build files for my personal
website, which is hosted via GitHub Pages and accessible at
[https://stuartmccoll.github.io/](https://stuartmccoll.github.io/).

## Pull the necessary submodule(s)

Within your terminal, run:

```bash
git submodule update --init --recursive
```

## How to run

To run the server, simply execute the following command in your terminal:

```bash
hugo server
```

## How to build

To build an up-to-date copy of the static files necessary for publishing the
site, execute the following command in your terminal:

```bash
hugo
```

If successful, this will re-populate the `public` directory if it already
exists, or create and populate it if not.

## Deployment

This site is deployed via a GitHub Action.

Upon merge of a pull request into the `main` branch, the GitHub Action
will update the `gh-pages` branch with the latest build of the static files.
This branch is then served via GitHub Pages.

## GitHub Codespaces

This repository contains all of the necessary configuration to run in a GitHub
Codespace.

To open the repository in a GitHub Codespace, follow these instructions:

1. Select the 'Code' dropdown on the repositorys main screen.
2. Select the 'Open with Codespaces' option.
3. Select the 'New codespace' option.
