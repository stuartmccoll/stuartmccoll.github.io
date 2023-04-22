---
categories:
  - Bicep
  - GitHub
  - GitHub Actions
  - Microsoft Azure
date: 2023-04-22T11:30:00+01:00
draft: false
lastMod: 2023-04-22T11:30:00+01:00
tags:
  - Bicep
  - GitHub
  - GitHub Actions
  - Microsoft Azure
title: Use GitHub Actions to validate Bicep files
---

In this post, I'll show you how to validate Bicep files using GitHub Actions.

## What is GitHub Actions?

GitHub Actions is a continuous integration and continuous delivery (CI/CD)
platform built into GitHub. It allows for the automation of build, test, and
deployment pipelines.

It can also be used for running workflows based on other repository events,
like automatically responding to created issues.

## The structure of a GitHub Actions workflow

GitHub Actions workflows are made up of three things.

### An event trigger

A GitHub Actions workflow can be configured to trigger based on an event
occuring in a GitHub repository, such as a pull request being opened, or
a branch being deleted.

### A job

A GitHub Actions workflow can contain one or more jobs. These can be run
sequentially, or in parallel.

Each job will run inside its own virtual machine runner, or inside a
container.

### Steps within a job

Each job has one or more steps. A step might be a script that you define,
or an action; a reusable extension.

Steps are executed in order, and on the same runner, meaning that you can
share data from one step to another.

## A GitHub Actions workflow for validating Bicep files

This example GitHub Actions workflow assumes that you want to validate
Bicep files when a pull request is raised against your repository. It also
assumes that the Bicep files that you wish to validate are contained within
the `.azure/bicep/` directory.

You should create a `.github` directory in the root of your repository. In
this directory, you should create another directory, this time named
`workflows`. Within here, create a new file named `bicep.yml`.

First, we have to define a name for the GitHub Actions workflow.

```yml
name: Validate Bicep files
```

Next, we have to define the repository event that will trigger the GitHub
Actions workflow.

```yml
on: pull_request
```

Finally, we have to define the job itself, and the steps that make up the job.

```yml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: az bicep build --file .azure/bicep/*.bicep
```

- We're definining a single job, named `validate`.
- We're declaring that this job will run on the latest version of Ubuntu
(`runs-on: ubuntu-latest`).
- We're declaring two steps. In the first step, we're reusing the `checkout`
action available on GitHub Marketplace. This allows our GitHub Actions
workflow to checkout our repository. In the second step, we're running an
Azure CLI command to build any files with a `.bicep` file extension within
the `.azure/bicep` directory. If any of these files fail to build, our
GitHub Actions workflow will report a failure, otherwise it will succeed.

Altogether, our `.github/workflows/bicep.yml` file looks like this:

```yml
name: Validate Bicep files

on: pull_request

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: az bicep build --file .azure/bicep/*.bicep
```

Once merged into the repository, any future pull requests raised will trigger
this GitHub Actions workflow to be run.

## Further reading

Further information on GitHub Actions can be found at
[GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/).
