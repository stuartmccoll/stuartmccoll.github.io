---
categories:
  - PowerShell
date: 2023-04-15T09:30:00+01:00
draft: false
lastMod: 2023-04-15T09:30:00+01:00
tags:
  - PowerShell
title: Use PowerShell to find empty files
---

In this post, I'll show you how to find empty files using PowerShell.

## Find empty files in the current working directory

The following command will retrieve empty files within the current working
directory (e.g., it won't recursively search within inner directories).
It'll return the full file path to any empty files that it finds.

```powershell
Get-ChildItem -File | Where-Object { $_.PSIsContainer -eq $false -and $_.Length -eq 0 } | Select -ExpandProperty FullName
```

We're using the `Get-ChildItem` cmdlet here to retrieve a list of all files
within the current working directory. We're then utilising the `Where-Object`
cmdlet to filter this list to return _only_ files
(`$_.PSIsContainer -eq $false`) and _only_ files with no length
(`-and $_.Length -eq 0`).

The final part of the command (`Select -ExpandProperty FullName`) returns
the full path to any empy files found.

## Find empty files beneath the current working directory

We can expand our search to recursively search within _all_ directories within
the current working directory by adding a single flag to the command -
`-Recurse`.

```powershell
Get-ChildItem -File -Recurse | Where-Object { $_.PSIsContainer -eq $false -and $_.Length -eq 0 } | Select -ExpandProperty FullName
```

## Further reading

Further information on the `Get-ChildItem` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem).

Further information on the `Where-Object` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/where-object?view=powershell-7.3).
