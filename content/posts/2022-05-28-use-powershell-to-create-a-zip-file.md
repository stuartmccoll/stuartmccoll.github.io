---
categories:
  - Automation
  - PowerShell
date: 2022-05-28T11:30:00+01:00
draft: false
lastMod: 2022-05-28T11:30:00+01:00
tags:
  - PowerShell
title: Use PowerShell to create a .zip file
---

A simple automation need that I stumbled across recently was the ability to
quickly create a `.zip` file from a static set of files and directories. Rather
than run a long command in PowerShell each time, I bundled everything up into a
quick function that I can run using `New-StaticZipFile`.

The `Compress-Archive` cmdlet lets us create a compressed, or zipped, archive
file. There are limitations (e.g. maximum file size is 2GB) to this cmdlet, as
well as more advanced options, such as the level of compression needed, but
we'll be keeping it _really_ simple here.

```
NAME
    Compress-Archive

SYNOPSIS
    Creates a compressed archive, or zipped file, from specified files and
    directories.

SYNTAX
    Compress-Archive [-Path] <System.String[]> [-DestinationPath] <System.String> [-CompressionLevel {Optimal | NoCompression |
    Fastest}] -Force [-PassThru] [-Confirm] [-WhatIf] [<CommonParameters>]
```

The `Path` argument we pass will be a list of the static files which we want
to add to our `.zip` file. So, to begin our function we'll create and populate
this list.

```powershell
$Files = New-Object -TypeName 'System.Collections.ArrayList'
$Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Document.docx')
$Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Worksheet.xlsx')
```

With our list of static files populated, we're ready for them to be compressed.
We'll also need to tell the `Compress-Archive` cmdlet where to put them, e.g.
the path to our newly-created archive, which we do using the `DestinationPath`
parameter.

```powershell
Compress-Archive -Path $(Files) -DestinationPath 'C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip'
```

Altogether, the function so far looks like:

```powershell
function New-StaticZipFile
{
  $Files = New-Object -TypeName 'System.Collections.ArrayList'
  $Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Document.docx')
  $Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Worksheet.xlsx')
  Compress-Archive -Path $(Files) -DestinationPath 'C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip'
}
```

This will work absolutely fine - on the first run. In your terminal, you'll see
the following output:

```
0
1
```

These numbers are output when we add to our `$Files` list. If we then run a
`Get-Item .\*` command, the output will be:

```
        Directory: C:\Users\StuartMcColl\Documents\


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
la---        28/05/2022     11:54           5475   MyArchive.zip
la---        28/05/2022     11:42              0   Document.docx
la---        28/05/2022     11:42           6191   Worksheet.xlsx
```

We can see that we've successfully created `MyArchive.zip`. If we run the
`New-StaticZipFile` function again, we'll be met with the following error:

```
The archive file C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip already
exists. Use the -Update parameter to update the existing archive file or use
the -Force parameter to overwrite the existing archive file.
```

We _could_ use the `Compress-Archive` cmdlet to update any existing
`MyArchive.zip` file if we find one, but for my use case I'm happy to remove
any existing file and simply create a new one. Rather than simply `-Force` the
overwrite of the existing archive file, I also want to _know_ that there was
already a `MyArchive.zip` file before I remove it.

```powershell
If (Test-Path -Path C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip -PathType Leaf)
{
  Write-Host 'Deleting existing MyArchive.zip file'
  Remove-Item -Path C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip
}
```

Altogether, with some additional output gives us:

```powershell
function New-StaticZipFile
{
  Write-Host 'Creating new MyArchive.zip file'

  $Files = New-Object -TypeName 'System.Collections.ArrayList'
  $Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Document.docx')
  $Files.Add('C:\Users\StuartMcColl\OneDrive\Documents\Worksheet.xlsx')

  If (Test-Path -Path C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip -PathType Leaf)
  {
    Write-Host 'Deleting existing MyArchive.zip file'
    Remove-Item -Path C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip
  }

  Compress-Archive -Path $(Files) -DestinationPath 'C:\Users\StuartMcColl\OneDrive\Documents\MyArchive.zip'

  Write-Host 'Finished creating new MyArchive.zip file'
}
```
