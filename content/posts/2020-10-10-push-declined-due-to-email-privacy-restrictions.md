---
title: "The Push Declined Due to Email Privacy Restrictions error"
date: 2020-10-10T11:41:22+01:00
draft: false
---

This is a quick blog post detailing what to do if you receive the `push declined due to email privacy restrictions` error when attempting to push to a GitHub repository.

The error message tells us that your GitHub account has been configured to disallow the pushing of commits which might reveal a personal email address. 

This means that in order to push commits to this remote repository, you'll need to do one of two things:

1. Enable command line pushes that will expose a personal email address.
2. Or, configure Git to use your GitHub noreply address.

I'm going to assume that you've configured your GitHub account to block command line pushes that expose a personal email address - however, if you didn't mean to do this and are happy to disable this setting then you can do so within the [emails settings](https://github.com/settings/emails) in GitHub. Find the '*Block command line pushes that expose my email*' setting and disable it by unchecking the checkbox.

If you'd like to keep this setting enabled and push commits to your remote repository, then you'll need to configure Git to use your GitHub no reply address. Let's start by grabbing that.

Head to the [Settings](https://github.com/settings/profile) section of GitHub, and then select the [Emails](https://github.com/settings/emails) menu item. In here, you'll find a checkbox labeled '*Keep my email addresses private*'. Within the description for this label, you'll find your GitHub noreply address. It'll be in the format `<number>+<your_github_username>@users.noreply.github.com`. Copy this to your clipboard, as we'll need it in a second.

In a terminal run the following command to add your GitHub noreply address to your global Git configuration:

```bash
git config --global user.email <number>+<your_github_username>@users.noreply.github.com
```

With that in place, we're going to want to reset the author on your previous commit. If you only made *one* commit, then you'll want to run the following command:

```bash
git commit --amend --reset-author
```

If you made multiple commits using your private email address, then you'll need to find the SHA for the commit *before* your first commit using your private email address. Once you have this, you'll want to run the following command (replacing `<sha_of_previous_commit>` with the SHA value found):

```bash
git rebase -i <sha_of_previous_commit> -x "git commit --amend --reset-author -CHEAD"
```

The `-x` parameter allows us to append a shell command after each line creating a commit in the final history.

Assuming everything worked okay, you'll now be able to run `git push` to push your commits to GitHub.
