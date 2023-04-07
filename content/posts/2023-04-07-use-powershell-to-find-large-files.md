---
categories:
  - PowerShell
date: 2023-04-07T12:00:00+01:00
draft: false
lastMod: 2023-04-07T12:00:00+01:00
tags:
  - PowerShell
title: Use PowerShell to find large files
---

In this post, I'll show you how to find large files using PowerShell.

## Using the `Get-ChildItem` cmdlet

Searching for files based on different properties can all be done using
PowerShell's built-in `Get-ChildItem` cmdlet.

### Find the largest files within the current working directory

The following command will retrieve the ten largest files within the current
working directory (e.g., it won't recursively search within inner directories).
It'll sort these ten results in descending size order, returning the file names
and the file size.

```powershell
Get-ChildItem -File | Sort -Descending -Property Length | Select -First 10 Name, Length
```

When running the above command, you'll receive a response that looks like the
output below.

```powershell
Name          Length
----          ------
FirstFile       2790
SecondFile      213
ThirdFile       182
...
```

### Find the largest files beneath the current working directory

We can expand our search to recursively search within _all_ directories within
the current working directory by adding a single flag to the command -
`-Recurse`.

The following command will retrieve the ten largest files beneath the current
working directory (e.g., it won't just find files inside the current working
directory, but will continue to search within inner directories). It'll sort
these ten results in descending size order, returning the file names and the
file size.

```powershell
Get-ChildItem -Recurse -File | Sort -Descending -Property Length | Select -First 10 Name, Length
```

### Find the largest file within a user profile

Perhaps you're only interested in finding the largest file within a given user
profile. This is easily done by passing the `$env:USERPROFILE` value to
`Get-ChildItem`.

```powershell
Get-ChildItem $env:USERPROFILE -Recurse -File | Sort -Descending -Property Length | Select -First 1
```

## Further reading

Further information on the `Get-ChildItem` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem).
