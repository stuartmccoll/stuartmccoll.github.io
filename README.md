# README.md

[![Run WebsiteArchiver](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/archival.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/archival.yml) [![Validate Bicep files](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/bicep.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/bicep.yml) [![Deploy to GitHub Pages](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/gh-pages.yml)

This repository contains both the source and build files for my personal
website, which is hosted via GitHub Pages and accessible at
[https://stuartmccoll.github.io/](https://stuartmccoll.github.io/).

## Pull the necessary submodule(s)

Within your terminal, run:

```bash
git submodule update --init --recursive
```

## How to update the theme submodule to the latest commit

Within your terminal, run:

```bash
git submodule update --remote --merge
```

You will then need to `git add` the theme submodule directory, and `git commit` this staged change.

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

## GitHub Actions

### Website Archiver

Previous versions of the website are archived by triggering an instance of
the [website-archiver](https://github.com/stuartmccoll/website-archiver)
running in Azure.

For this workflow to run successfully, the following repository secrets
must be configured:

* `AZURE_BLOB_STORAGE_CONNECTION_STRING`
* `AZURE_CONTAINER_REGISTRY_LOGIN_SERVER`
* `AZURE_CONTAINER_REGISTRY_PASSWORD`
* `AZURE_CONTAINER_REGISTRY_USERNAME`
* `AZURE_CREDENTIALS`

The `AZURE_CREDENTIALS` value should be in the following format:

```json
{
    "clientId":"${{ Azure App Registration Client ID }}",
    "clientSecret":"${{ Azure App Registration Client Secret }}",
    "subscriptionId":"${{ Azure Subscription ID }}",
    "tenantId":"${{ Azure Tenant ID }}"
}
```

## GitHub Codespaces

This repository contains all of the necessary configuration to run in a GitHub
Codespace.

To open the repository in a GitHub Codespace, follow these instructions:

1. Select the 'Code' dropdown on the repositorys main screen.
2. Select the 'Open with Codespaces' option.
3. Select the 'New codespace' option.
