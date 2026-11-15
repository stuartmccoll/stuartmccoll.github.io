# README.md

[![Run WebsiteArchiver](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/archival.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/archival.yml) [![Validate Bicep files](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/bicep.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/bicep.yml) [![Deploy to GitHub Pages](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/stuartmccoll/stuartmccoll.github.io/actions/workflows/gh-pages.yml)

This repository contains both the source and build files for my personal
website, which is hosted via GitHub Pages and accessible at
[https://stuartmccoll.github.io/](https://stuartmccoll.github.io/).

## Theme

The site uses a custom theme, `azure`, which lives in this repository under
[`themes/azure`](themes/azure). It is styled after Microsoft Azure, with
switchable colour schemes, and is not a submodule, so there is nothing extra
to pull.

Most of the site's wording (the home page hero, the footer summary, social
links and so on) is set under `[params]` in [`config.toml`](config.toml),
rather than in the theme itself.

## How to run

To run a local server, execute the following command in your terminal:

```bash
hugo server
```

Add `-D` to include draft posts.

## How to build

To build an up-to-date copy of the static files necessary for publishing the
site, execute the following command in your terminal:

```bash
hugo
```

If successful, this will re-populate the `public` directory if it already
exists, or create and populate it if not.

## Writing a post

Create a new post with:

```bash
hugo new posts/YYYY-MM-DD-post-title.md
```

New posts start as drafts. Set `draft: false` when the post is ready to
publish.

Write tags with the casing you want shown on the site (for example `AWS`,
`macOS`, `PowerShell`), because tag names are displayed exactly as written.

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

> **Paused:** this workflow no longer runs on merge to `main` while it is
> being reworked. It can still be run manually from the Actions tab.

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

1. Select the 'Code' dropdown on the repository's main screen.
2. Select the 'Open with Codespaces' option.
3. Select the 'New codespace' option.
