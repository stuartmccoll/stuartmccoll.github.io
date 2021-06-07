+++
date = "2018-06-23 22:50:00 +0000"
description = "GitLab Changelog Generator"
linktitle = ""
title = "GitLab Changelog Generator"
slug = "GitLab Changelog Generator"
type = "post"
+++

I've recently written a small command line utility using Python 3.6 which will produce a `CHANGELOG.md` file from the commit differences between two different GitLab project branches. I've released this as an open source Python package and it's available from PyPi [here](https://pypi.org/project/pip/). Not intended to be a direct replacement for writing a manual changelog, the utility should be used as a draft upon which to build.

This was a small project to trial a few things; Python's type hinting, which was added in [PEP484](https://www.python.org/dev/peps/pep-0484/); [Facebook Open Source's](https://opensource.fb.com/) type checker [Pyre](https://pyre-check.org/); and [Black](https://github.com/ambv/black) 'the uncompromising Python code formatter'.

If you're interested in using this utility, you can install it using [pip](https://pypi.org/project/pip/) by running the following command:

```bash
$ pip install gitlab-changelog-generator
```

An example command to generate a `CHANGELOG.md` file from the difference in commits between `master` and `release` branches for a locally hosted GitLab repository project named 'test-project', labelling the version as 1.1.

```bash
$ changegen --ip localhost --group test-projects --project test-project --branches master release --version 1.1
```

I've got some tidying up left to do such as better exception handling and cleaner logging, but the package works in it's current state. You can contribute features or towards existing issues by raising a [pull request](https://help.github.com/articles/creating-a-pull-request/) at the project GitHub [repository](https://github.com/stuartmccoll/gitlab-changelog-generator).
